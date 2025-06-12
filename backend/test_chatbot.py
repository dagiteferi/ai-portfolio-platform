import requests
import json
import subprocess
import sys
import logging
import time
import os
import threading
import socket

# Configure logging
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
        {"name": "Alice", "session_id": "alice123", "queries": ["HI", "how are you", "Tell me about Dagi", "What is Dagi’s most recent project?"]},
        {"name": "Bob", "session_id": "bob456", "queries": ["I’m hiring", "where did Dagi intern?"]}
    ]

    # Change to parent directory to treat 'backend' as a package
    original_dir = os.getcwd()
    os.chdir("..")
    port = find_free_port(8000)
    BASE_URL = f"http://127.0.0.1:{port}/api/chat"
    try:
        server_process = subprocess.Popen(
            ["uvicorn", f"backend.main:app", "--host", "127.0.0.1", "--port", str(port), "--reload"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )

        try:
            def log_uvicorn_output():
                for line in server_process.stdout:
                    logger.debug(f"Uvicorn Output: {line.strip()}")
                    print(f"Uvicorn Output: {line.strip()}")

            threading.Thread(target=log_uvicorn_output, daemon=True).start()

            time.sleep(10)  # Wait for server to start

            try:
                response = requests.get(f"http://127.0.0.1:{port}")
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
                    print(f"\nTesting conversation for {user['name']} (Session ID: {user['session_id']})")
                    print(f"Query: {query}")
                    payload = {"message": query, "user_name": user["name"], "history": history}
                    try:
                        response = requests.post(BASE_URL, json=payload)
                        print(f"Status Code: {response.status_code}")
                        response_data = response.json()
                        print(f"Response Data: {response_data}")
                        print(f"Response: {response_data.get('response')}")
                        history.append({"user": query, "assistant": response_data.get("response", "")})
                    except Exception as e:
                        logger.error(f"Error during request for {user['name']}: {str(e)}")
                        print(f"Error: {str(e)}")

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            print(f"Unexpected error: {str(e)}")
    finally:
        server_process.terminate()
        server_process.wait()
        os.chdir(original_dir)  # Restore original directory

if __name__ == "__main__":
    test_conversation()