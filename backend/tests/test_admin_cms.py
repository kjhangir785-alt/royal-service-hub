"""Backend tests for The Bullet Zone Admin CMS: auth, content, upload, bookings guard."""
import os
import io
import pytest
import requests

def _read_frontend_env():
    p = "/app/frontend/.env"
    if os.path.exists(p):
        for line in open(p):
            if line.startswith("REACT_APP_BACKEND_URL"):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    return None

BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or _read_frontend_env()).rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "ayub@thebulletzone.in"
ADMIN_PASSWORD = "BulletZone@2026"


@pytest.fixture(scope="module")
def s():
    return requests.Session()


@pytest.fixture(scope="module")
def token(s):
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    j = r.json()
    assert "token" in j and "user" in j
    assert j["user"]["email"] == ADMIN_EMAIL
    return j["token"]


@pytest.fixture(scope="module")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Auth ----------
def test_login_wrong_password(s):
    # use a distinct fake email so we do not increment lockout for admin
    r = s.post(f"{API}/auth/login", json={"email": "nobody-tbz@example.com", "password": "wrong"})
    assert r.status_code == 401


def test_me_requires_token(s):
    r = s.get(f"{API}/auth/me")
    assert r.status_code == 401


def test_me_with_token(s, auth_headers):
    r = s.get(f"{API}/auth/me", headers=auth_headers)
    assert r.status_code == 200
    body = r.json()
    assert body["email"] == ADMIN_EMAIL
    assert body.get("role") == "admin"
    assert "password_hash" not in body
    assert "_id" not in body


# ---------- Protected endpoints require token ----------
@pytest.mark.parametrize("method,path", [
    ("GET", "/bookings"),
    ("PUT", "/content"),
    ("POST", "/content/reset"),
    ("GET", "/auth/users"),
    ("POST", "/auth/users"),
    ("POST", "/admin/upload"),
])
def test_protected_endpoints_require_auth(s, method, path):
    r = s.request(method, f"{API}{path}", json={} if method != "GET" else None)
    assert r.status_code == 401, f"{method} {path} -> {r.status_code}"


# ---------- Content ----------
def test_get_content_public(s):
    r = s.get(f"{API}/content")
    assert r.status_code == 200
    data = r.json()
    for k in ["business", "hero", "about", "services", "models", "modifications",
              "accessories", "gallery", "reviews", "faqs"]:
        assert k in data, f"missing content section: {k}"


def test_put_content_and_reset(s, auth_headers):
    # get current tagline
    original = s.get(f"{API}/content").json()
    biz = dict(original.get("business", {}))
    old_tag = biz.get("tagline", "")
    new_tag = "TEST_TAGLINE_" + os.urandom(3).hex()
    biz["tagline"] = new_tag

    r = s.put(f"{API}/content", json={"data": {"business": biz}}, headers=auth_headers)
    assert r.status_code == 200
    # verify persisted
    r2 = s.get(f"{API}/content")
    assert r2.json()["business"]["tagline"] == new_tag

    # reset
    r3 = s.post(f"{API}/content/reset", headers=auth_headers)
    assert r3.status_code == 200
    r4 = s.get(f"{API}/content")
    assert r4.json()["business"]["tagline"] == old_tag or r4.json()["business"]["tagline"] != new_tag


# ---------- Upload ----------
def test_upload_image(s, auth_headers):
    # 1x1 PNG
    png_bytes = bytes.fromhex(
        "89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C489"
        "0000000D49444154789C6300010000000500010D0A2DB40000000049454E44AE426082"
    )
    files = {"file": ("test.png", io.BytesIO(png_bytes), "image/png")}
    r = s.post(f"{API}/admin/upload", files=files, headers=auth_headers)
    assert r.status_code == 200, r.text
    url = r.json()["url"]
    assert url.startswith("/api/files/")
    # public fetch
    r2 = s.get(f"{BASE_URL}{url}")
    assert r2.status_code == 200
    assert r2.headers.get("content-type", "").startswith("image/")


def test_upload_rejects_non_image(s, auth_headers):
    files = {"file": ("bad.txt", io.BytesIO(b"hello"), "text/plain")}
    r = s.post(f"{API}/admin/upload", files=files, headers=auth_headers)
    assert r.status_code == 400


# ---------- Bookings guard + list ----------
def test_bookings_list_authenticated(s, auth_headers):
    r = s.get(f"{API}/bookings", headers=auth_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_bookings_create_and_delete_cycle(s, auth_headers):
    # public create
    payload = {"name": "TEST_CMSRider", "phone": "+919000000001",
               "bike_model": "Classic 350", "service": "General Service"}
    r = s.post(f"{API}/bookings", json=payload)
    assert r.status_code == 200
    bid = r.json()["id"]
    # list and confirm
    lst = s.get(f"{API}/bookings", headers=auth_headers).json()
    assert any(b["id"] == bid for b in lst)
    # delete
    r2 = s.delete(f"{API}/bookings/{bid}", headers=auth_headers)
    assert r2.status_code == 200
    lst2 = s.get(f"{API}/bookings", headers=auth_headers).json()
    assert not any(b["id"] == bid for b in lst2)


# ---------- Admin users CRUD ----------
def test_admin_users_flow(s, auth_headers):
    # list current
    r = s.get(f"{API}/auth/users", headers=auth_headers)
    assert r.status_code == 200
    users_before = r.json()
    assert isinstance(users_before, list)
    assert all("password_hash" not in u for u in users_before)

    # create
    email = f"test_admin_{os.urandom(3).hex()}@example.com"
    r = s.post(f"{API}/auth/users",
               json={"email": email, "password": "TestPass@123", "name": "TEST_Admin"},
               headers=auth_headers)
    assert r.status_code == 200, r.text
    new_id = r.json()["id"]

    # duplicate
    r_dup = s.post(f"{API}/auth/users",
                   json={"email": email, "password": "TestPass@123", "name": "dup"},
                   headers=auth_headers)
    assert r_dup.status_code == 400

    # login as new
    r_login = s.post(f"{API}/auth/login", json={"email": email, "password": "TestPass@123"})
    assert r_login.status_code == 200

    # cannot delete self
    new_token = r_login.json()["token"]
    new_uid = r_login.json()["user"]["id"]
    r_self = s.delete(f"{API}/auth/users/{new_uid}",
                      headers={"Authorization": f"Bearer {new_token}"})
    assert r_self.status_code == 400

    # delete via primary admin
    r_del = s.delete(f"{API}/auth/users/{new_id}", headers=auth_headers)
    assert r_del.status_code == 200
    users_after = s.get(f"{API}/auth/users", headers=auth_headers).json()
    assert not any(u["id"] == new_id for u in users_after)
