import pytest
import uvicorn
import requests
import time
import logging
import os
import sys
from multiprocessing import Process
from fastapi.testclient import TestClient
from tenacity import retry, stop_after_attempt, wait_fixed

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

try:
    from backend.main import app
except ImportError as e:
    raise ImportError(f"Failed to import backend.main: {str(e)}")

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('chatbot_test.log')
    ]
)
logger = logging.getLogger(__name__)

HOST = "127.0.0.1"
PORT = 8001
BASE_URL = f"http://{HOST}:{PORT}"

def run_server():
    try:
        uvicorn.run(
            "backend.main:app",
            host=HOST,
            port=PORT,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Server failed to start: {str(e)}")
        raise

@pytest.fixture(scope="module")
def server():
    proc = Process(target=run_server, daemon=True)
    proc.start()
    time.sleep(10)
    max_attempts = 5
    attempt = 1
    while attempt <= max_attempts:
        try:
            response = requests.get(f"{BASE_URL}/health", timeout=5)
            if response.status_code == 200:
                logger.info(f"Uvicorn server started successfully on port {PORT}")
                break
        except requests.RequestException as e:
            logger.debug(f"Health check attempt {attempt} on port {PORT} failed: {str(e)}")
            time.sleep(2)
            attempt += 1
    if attempt > max_attempts:
        logger.error(f"Failed to start Uvicorn server on port {PORT} after {max_attempts} attempts")
        proc.terminate()
        raise RuntimeError("Server failed to start")
    yield
    proc.terminate()

@pytest.fixture
def client():
    return TestClient(app)

def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def make_chat_request(user):
    try:
        response = requests.post(
            f"{BASE_URL}/api/chat",
            json={
                "message": user["query"],
                "user_name": user["name"],
                "session_id": user["session_id"],  # ✅ Add this line
                "history": []
            },
            timeout=30
        )
        return response
    except requests.RequestException as e:
        logger.error(f"Request failed for {user['name']}: {str(e)}")
        raise


def test_chatbot_conversation(server):
    users = [
        {"name": "Alice", "session_id": "alice123", "query": "HI", "expected": "Hey Alice! I’m Dagi—excited to chat! What brought you here today?"},
        {"name": "Bob", "session_id": "bob456", "query": "Tell me about Dagi’s projects", "expected_contains": "AI Portfolio Platform"},
        {"name": "Charlie", "session_id": "charlie789", "query": "Where did Dagi intern?", "expected_contains": "Kifiya"}
    ]

    for user in users:
        logger.info(f"Testing conversation for {user['name']} (Session ID: {user['session_id']}) - Query: {user['query']}")
        try:
            response = make_chat_request(user)
            logger.info(f"Status Code: {response.status_code}")
            logger.info(f"Response Data: {response.json()}")
            logger.info(f"Response: {response.text}")

            assert response.status_code == 200, f"Request failed with status {response.status_code}: {response.json()}"
            response_data = response.json()
            if "expected" in user:
                assert response_data["response"] == user["expected"], f"Unexpected response for {user['name']}: {response_data['response']}"
            elif "expected_contains" in user:
                assert user["expected_contains"] in response_data["response"], f"Response for {user['name']} does not contain {user['expected_contains']}: {response_data['response']}"
        except requests.RequestException as e:
            logger.error(f"Error during request for {user['name']}: {str(e)}")
            raise AssertionError(f"Request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            raise AssertionError(f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    try:
        from backend.ai_core.knowledge.static_loader import load_static_content
        documents = load_static_content(source="all")
        if not isinstance(documents, list):
            logger.error(f"GitHub knowledge base is not a list: {type(documents)}")
    except Exception as e:
        logger.error(f"Error loading knowledge base: {str(e)}")
    pytest.main(["-v", __file__])