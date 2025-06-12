import requests
import json
import subprocess
import sys
import logging
import time
import os
import threading
import socket

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout), logging.FileHandler('test_chatbot_debug.log')]
)
logger = logging.getLogger(__name__)

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('127.0.0.1', port)) == 0

def find_free_port(start_port=8000):
    port = start_port
    while is_port_in_use(port):
        port += 1
    return port

def test_conversation():
    users = [
        {
            "name": "Alice",
            "session_id": "alice123",
            "queries": [
                "HI",
                "how are you",
                "Tell me about Dagi",
                "What is Dagi’s most recent project?",
                "What are your GitHub projects?"
            ]
        },
        {
            "name": "Bob",
            "session_id": "bob456",
            "queries": [
                "I’m hiring",
                "where did Dagi intern?",
                "Tell me about your GitHub repositories"
            ]
        }
    ]

    original_dir = os.getcwd()
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = find_free_port(8000)
    BASE_URL = f"http://127.0.0.1:{port}/api/chat"
    server_process = None
    try:
        server_process = subprocess.Popen(
            ["uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", str(port), "--reload"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )

        def log_uvicorn_output():
            for line in server_process.stdout:
                logger.debug(f"Uvicorn Output: {line.strip()}")

        threading.Thread(target=log_uvicorn_output, daemon=True).start()

        time.sleep(10)  # Wait for server to start
        try:
            response = requests.get(f"http://127.0.0.1:{port}", timeout=5)
            if response.status_code == 200 or "/api/chat" in response.text:
                logger.info(f"Uvicorn server started successfully on port {port}")
            else:
                raise Exception(f"Unexpected status code: {response.status_code}")
        except requests.ConnectionError:
            logger.error(f"Failed to connect to Uvicorn server on port {port}")
            raise Exception("Uvicorn server failed to start")

        for user in users:
            history = []
            for query in user["queries"]:
                logger.info(f"Testing conversation for {user['name']} (Session ID: {user['session_id']}) - Query: {query}")
                payload = {"message": query, "user_name": user["name"], "history": history}
                try:
                    response = requests.post(BASE_URL, json=payload, timeout=10)
                    logger.info(f"Status Code: {response.status_code}")
                    response_data = response.json()
                    logger.info(f"Response Data: {response_data}")
                    response_text = response_data.get("response", "")
                    logger.info(f"Response: {response_text}")
                    history.append({"user": query, "assistant": response_text})

                    # Validate responses
                    if "GitHub" in query:
                        assert any(word in response_text.lower() for word in ["github", "repository", "project"]), \
                            f"Expected GitHub-related response for query '{query}', got: {response_text}"
                    elif "project" in query:
                        assert any(word in response_text.lower() for word in ["portfolio", "fraud", "project"]), \
                            f"Expected project-related response for query '{query}', got: {response_text}"
                    elif "intern" in query:
                        assert "kifiya" in response_text.lower(), \
                            f"Expected internship mention for query '{query}', got: {response_text}"
                    elif "dagi" in query.lower():
                        assert any(word in response_text.lower() for word in ["skills", "experience", "project"]), \
                            f"Expected profile details for query '{query}', got: {response_text}"

                except Exception as e:
                    logger.error(f"Error during request for {user['name']}: {str(e)}")
                    raise

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise
    finally:
        if server_process:
            server_process.terminate()
            server_process.wait(timeout=5)
        os.chdir(original_dir)

if __name__ == "__main__":
    try:
        test_conversation()
        logger.info("All tests passed successfully!")
    except Exception as e:
        logger.error(f"Test suite failed: {str(e)}")
        sys.exit(1)