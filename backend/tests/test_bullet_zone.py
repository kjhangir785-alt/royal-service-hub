"""Backend tests for The Bullet Zone API - root & bookings endpoints."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://royal-service-hub-1.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def test_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert "running" in r.json().get("message", "").lower()


def test_create_booking_and_persist(client):
    payload = {
        "name": "TEST_Rider Ayub",
        "phone": "+91 9999999999",
        "bike_model": "Classic 350",
        "service": "General Service",
        "preferred_date": "2026-02-15",
        "message": "TEST booking - please ignore",
    }
    r = client.post(f"{API}/bookings", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["id"]
    assert data["name"] == payload["name"]
    assert data["bike_model"] == "Classic 350"
    assert data["service"] == "General Service"
    assert data["preferred_date"] == "2026-02-15"
    assert "created_at" in data

    booking_id = data["id"]

    # GET list - verify persistence
    r2 = client.get(f"{API}/bookings")
    assert r2.status_code == 200
    lst = r2.json()
    assert isinstance(lst, list)
    ids = [b["id"] for b in lst]
    assert booking_id in ids
    match = next(b for b in lst if b["id"] == booking_id)
    assert match["phone"] == payload["phone"]
    # Ensure no _id leaks
    assert "_id" not in match


def test_create_booking_missing_required_fields(client):
    # missing bike_model & service
    r = client.post(f"{API}/bookings", json={"name": "x", "phone": "1"})
    assert r.status_code == 422


def test_create_booking_optional_fields_default(client):
    payload = {
        "name": "TEST_MinRider",
        "phone": "1234567890",
        "bike_model": "Hunter 350",
        "service": "Oil Change",
    }
    r = client.post(f"{API}/bookings", json=payload)
    assert r.status_code == 200
    d = r.json()
    assert d["preferred_date"] == ""
    assert d["message"] == ""
