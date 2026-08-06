from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, UploadFile, File, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import logging
import uuid
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Any, Dict
from datetime import datetime, timezone, timedelta

import auth as auth_mod
import storage as storage_mod
from content_defaults import default_content

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="The Bullet Zone API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- Models ----------
class BookingCreate(BaseModel):
    name: str
    phone: str
    bike_model: str
    service: str
    preferred_date: Optional[str] = ""
    message: Optional[str] = ""


class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    bike_model: str
    service: str
    preferred_date: Optional[str] = ""
    message: Optional[str] = ""
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = "Admin"


class ContentUpdate(BaseModel):
    data: Dict[str, Any]


# ---------- Auth dependency ----------
async def current_user(request: Request):
    return await auth_mod.get_current_user(request, db)


# ---------- Basic ----------
@api_router.get("/")
async def root():
    return {"message": "The Bullet Zone API is running"}


# ---------- Bookings ----------
@api_router.post("/bookings", response_model=Booking)
async def create_booking(input: BookingCreate):
    booking = Booking(**input.model_dump())
    await db.bookings.insert_one(booking.model_dump())
    return booking


@api_router.get("/bookings", response_model=List[Booking])
async def get_bookings(user: dict = Depends(current_user)):
    bookings = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Booking(**b) for b in bookings]


@api_router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str, user: dict = Depends(current_user)):
    await db.bookings.delete_one({"id": booking_id})
    return {"ok": True}


# ---------- Auth ----------
@api_router.post("/auth/login")
async def login(input: LoginInput):
    email = input.email.lower()
    attempt = await db.login_attempts.find_one({"email": email})
    now = datetime.now(timezone.utc)
    if attempt and attempt.get("count", 0) >= 5:
        locked_until = datetime.fromisoformat(attempt["locked_until"]) if attempt.get("locked_until") else None
        if locked_until and locked_until > now:
            raise HTTPException(status_code=429, detail="Too many attempts. Try again in a few minutes.")

    user = await db.users.find_one({"email": email})
    if not user or not auth_mod.verify_password(input.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"email": email},
            {"$inc": {"count": 1}, "$set": {"locked_until": (now + timedelta(minutes=15)).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")

    await db.login_attempts.delete_one({"email": email})
    token = auth_mod.create_access_token(user["id"], user["email"])
    return {"token": token, "user": {"id": user["id"], "email": user["email"], "name": user.get("name"), "role": user.get("role", "admin")}}


@api_router.get("/auth/me")
async def me(user: dict = Depends(current_user)):
    return user


@api_router.get("/auth/users")
async def list_users(user: dict = Depends(current_user)):
    users = await db.users.find({}, {"password_hash": 0, "_id": 0}).to_list(200)
    return users


@api_router.post("/auth/users")
async def create_user(input: UserCreate, user: dict = Depends(current_user)):
    email = input.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="A user with this email already exists")
    doc = {
        "id": str(uuid.uuid4()),
        "email": email,
        "password_hash": auth_mod.hash_password(input.password),
        "name": input.name or "Admin",
        "role": "admin",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    return {"id": doc["id"], "email": doc["email"], "name": doc["name"], "role": doc["role"]}


@api_router.delete("/auth/users/{user_id}")
async def delete_user(user_id: str, user: dict = Depends(current_user)):
    total = await db.users.count_documents({})
    if total <= 1:
        raise HTTPException(status_code=400, detail="Cannot delete the only admin account")
    if user_id == user["id"]:
        raise HTTPException(status_code=400, detail="You cannot delete your own account")
    await db.users.delete_one({"id": user_id})
    return {"ok": True}


# ---------- Content (CMS) ----------
async def _get_content_doc():
    doc = await db.site_content.find_one({"key": "main"}, {"_id": 0})
    if not doc:
        data = default_content()
        await db.site_content.insert_one({"key": "main", "data": data})
        return data
    return doc["data"]


@api_router.get("/content")
async def get_content():
    return await _get_content_doc()


@api_router.put("/content")
async def update_content(input: ContentUpdate, user: dict = Depends(current_user)):
    current = await _get_content_doc()
    current.update(input.data)  # merge top-level sections
    await db.site_content.update_one({"key": "main"}, {"$set": {"data": current}}, upsert=True)
    return current


@api_router.post("/content/reset")
async def reset_content(user: dict = Depends(current_user)):
    data = default_content()
    await db.site_content.update_one({"key": "main"}, {"$set": {"data": data}}, upsert=True)
    return data


# ---------- File upload / serve ----------
@api_router.post("/admin/upload")
async def upload_file(file: UploadFile = File(...), user: dict = Depends(current_user)):
    ext = (file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else "bin")
    if ext not in storage_mod.MIME_TYPES:
        raise HTTPException(status_code=400, detail="Only image files (jpg, png, webp, gif) are allowed")
    path = f"{storage_mod.APP_NAME}/uploads/{uuid.uuid4()}.{ext}"
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large (max 10MB)")
    content_type = file.content_type or storage_mod.MIME_TYPES[ext]
    try:
        result = storage_mod.put_object(path, data, content_type)
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=502, detail="Image upload failed. Please try again.")
    await db.files.insert_one({
        "id": str(uuid.uuid4()),
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": content_type,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"url": f"/api/files/{result['path']}"}


@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = storage_mod.get_object(path)
    except Exception:
        raise HTTPException(status_code=404, detail="File not found")
    return Response(content=data, media_type=record.get("content_type", content_type),
                    headers={"Cache-Control": "public, max-age=31536000"})


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await auth_mod.seed_admin(db)
    await _get_content_doc()
    try:
        storage_mod.init_storage()
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
