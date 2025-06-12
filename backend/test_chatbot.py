import requests
import json
import subprocess
import sys
import logging
import time
import os
import threading
import socket
import pathlib

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout), logging.FileHandler('test_chatbot_debug.log')]
)
logger = logging.getLogger(__name__)

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

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

    project_root = pathlib.Path(__file__).parent.absolute()
    original_dir = os.getcwd()
    os.chdir(project_root)
    sys.path.insert(0, str(project_root))

    port = find_free_port(8000)
    base_url = f"http://127.0.0.1:{port}/api/chatbot"
    health_url = f"http://127.0.0.1:{port}/health"
    fallback_port = 8000  # Fallback to default port if dynamic port fails
    fallback_health_url = f"http://127.0.0.1:{fallback_port}/health"
    server_process = None
    try:
        server_process = subprocess.Popen(
            ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", str(port), "--reload"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
            cwd=str(project_root)
        )

        def log_uvicorn_output():
            for line in server_process.stdout:
                logger.debug(f"Uvicorn Output: {line.strip()}")

        threading.Thread(target=log_uvicorn_output, daemon=True).start()

        # Wait for server to start with retries
        max_attempts = 10
        attempt = 0
        server_started = False
        while attempt < max_attempts:
            time.sleep(6)  # Increased wait time per attempt
            try:
                response = requests.get(health_url, timeout=5)
                if response.status_code == 200:
                    logger.info(f"Uvicorn server started successfully on port {port}")
                    server_started = True
                    break
                logger.debug(f"Health check attempt {attempt + 1} on port {port} returned status: {response.status_code}")
            except requests.ConnectionError:
                logger.debug(f"Health check attempt {attempt + 1} on port {port} failed: Server not yet running")
            attempt += 1

        # Try fallback port if primary port fails
        if not server_started:
            logger.warning(f"Failed to start server on port {port}, trying fallback port {fallback_port}")
            attempt = 0
            while attempt < max_attempts:
                time.sleep(6)
                try:
                    response = requests.get(fallback_health_url, timeout=5)
                    if response.status_code == 200:
                        logger.info(f"Uvicorn server found on fallback port {fallback_port}")
                        server_started = True
                        port = fallback_port
                        base_url = f"http://127.0.0.1:{port}/api/chatbot"
                        break
                    logger.debug(f"Fallback health check attempt {attempt + 1} on port {fallback_port} returned status: {response.status_code}")
                except requests.ConnectionError:
                    logger.debug(f"Fallback health check attempt {attempt + 1} on port {fallback_port} failed: Server not yet running")
                attempt += 1

        if not server_started:
            raise Exception(f"Uvicorn server failed to start after {max_attempts} attempts on ports {port} and {fallback_port}")

        # Check if GitHub knowledge base is loaded
        github_path = os.path.join(project_root, "ai_core", "knowledge", "github_knowledge_base.json")
        if not os.path.exists(github_path):
            logger.warning(f"GitHub knowledge base not found at: {github_path}. GitHub queries may fall back to static data.")

        for user in users:
            history = []
            for query in user["queries"]:
                logger.info(f"Testing conversation for {user['name']} (Session ID: {user['session_id']}) - Query: {query}")
                payload = {"message": query, "user_name": user["name"], "history": history}
                try:
                    response = requests.post(base_url, json=payload, timeout=10)
                    logger.info(f"Status Code: {response.status_code}")
                    response_data = response.json()
                    logger.info(f"Response Data: {response_data}")
                    response_text = response_data.get("response", "")
                    logger.info(f"Response: {response_text}")
                    history.append({"user": query, "assistant": response_text})

                    # Validate responses
                    if "github" in query.lower():
                        if os.path.exists(github_path):
                            assert any(word in response_text.lower() for word in ["github", "repository", "project"]), \
                                f"Expected GitHub-related response for query '{query}', got: {response_text}"
                        else:
                            logger.warning(f"Skipping GitHub response validation for '{query}' due to missing github_knowledge_base.json")
                    elif "project" in query.lower():
                        assert any(word in response_text.lower() for word in ["portfolio", "fraud", "project"]), \
                            f"Expected project-related response for query '{query}', got: {response_text}"
                    elif "intern" in query.lower():
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
            try:
                server_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server_process.kill()
        os.chdir(original_dir)
        if str(project_root) in sys.path:
            sys.path.remove(str(project_root))

if __name__ == "__main__":
    try:
        test_conversation()
        logger.info("All tests passed successfully!")
    except Exception as e:
        logger.error(f"Test suite failed: {str(e)}")
        sys.exit(1)