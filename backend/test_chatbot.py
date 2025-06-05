import requests

def test_chatbot():
    base_url = "http://127.0.0.1:8000"
    test_cases = [
        {"user_name": "Alice", "session_id": "alice123", "message": "HI"},
        {"user_name": "Alice", "session_id": "alice123", "message": "how are you"},
        {"user_name": "Alice", "session_id": "alice123", "message": "Tell me about Dagi"},
        {"user_name": "Alice", "session_id": "alice123", "message": "What projects?"},
        {"user_name": "Bob", "session_id": "bob456", "message": "I’m hiring"},
        {"user_name": "Bob", "session_id": "bob456", "message": "What experience?"},
    ]

    for case in test_cases:
        response = requests.post(f"{base_url}/chat", json=case)
        print(f"\nTesting conversation for {case['user_name']} (Session ID: {case['session_id']})")
        print(f"Query: {case['message']}")
        print(f"Status Code: {response.status_code}")
        print(f"Response Data: {response.json()}")
        print(f"Response: {response.json().get('response', 'Failed - See Response Data for details')}")

if __name__ == "__main__":
    test_chatbot()