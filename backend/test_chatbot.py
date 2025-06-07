import requests
import json
import subprocess
import sys
import logging
import time
import os
import threading

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout), logging.FileHandler('test_chatbot_debug.log')]
)
logger = logging.getLogger(__name__)

BASE_URL = "http://127.0.0.1:8000/api/chat"

def test_conversation():
    users = [
        {"name": "Alice", "session_id": "alice123", "queries": ["HI", "how are you", "Tell me about Dagi", "What is Dagi’s most recent project?"]},
        {"name": "Bob", "session_id": "bob456", "queries": ["I’m hiring", "where did Dagi intern?"]}
    ]

    # Change to parent directory to treat 'backend' as a package
    original_dir = os.getcwd()
    os.chdir("..")
    try:
        server_process = subprocess.Popen(
            ["uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
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

            time.sleep(10)

            try:
                response = requests.get("http://127.0.0.1:8000")
                if response.status_code == 200 or "/api/chat" in response.text:
                    logger.info("Uvicorn server started successfully")
                else:
                    raise Exception(f"Unexpected status code: {response.status_code}")
            except requests.ConnectionError:
                logger.error("Failed to connect to Uvicorn server")
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