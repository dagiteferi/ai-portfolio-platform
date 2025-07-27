import pytest
import os
from fastapi.testclient import TestClient
from backend.main import app

# Set up environment variables for admin credentials for testing
os.environ["ADMIN_USERNAME"] = "testadmin"
os.environ["ADMIN_PASSWORD"] = "testpassword"

@pytest.fixture(scope="module")
def client():
    return TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_log_directory():
    log_dir = "/home/dagi/Documents/ai-portfolio-platform/logs"
    os.makedirs(log_dir, exist_ok=True)
    # Create a dummy log file for testing
    dummy_log_file = os.path.join(log_dir, "test.log")
    with open(dummy_log_file, "w") as f:
        f.write("This is a test log entry.")
    yield
    # Clean up the dummy log file and directory after tests
    os.remove(dummy_log_file)
    # os.rmdir(log_dir) # Only remove if empty, otherwise it will fail

def test_admin_login_success(client):
    response = client.post(
        "/api/admin/login",
        json={
            "username": os.getenv("ADMIN_USERNAME"),
            "password": os.getenv("ADMIN_PASSWORD")
        }
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Login successful"}

def test_admin_login_failure(client):
    response = client.post(
        "/api/admin/login",
        json={
            "username": "wrongadmin",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid credentials"}

def test_get_admin_logs_unauthorized(client):
    response = client.get("/api/admin/logs")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

def test_get_admin_logs_success(client):
    # First, log in to get authenticated
    login_response = client.post(
        "/api/admin/login",
        json={
            "username": os.getenv("ADMIN_USERNAME"),
            "password": os.getenv("ADMIN_PASSWORD")
        }
    )
    assert login_response.status_code == 200

    # Now, make the request to get logs
    response = client.get("/api/admin/logs")
    assert response.status_code == 200
    assert "logs" in response.json()
    assert isinstance(response.json()["logs"], dict)
    assert "test.log" in response.json()["logs"]
    assert response.json()["logs"]["test.log"] == "This is a test log entry."

