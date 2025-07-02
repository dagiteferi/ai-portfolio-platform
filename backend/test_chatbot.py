import requests

BASE_URL = "http://127.0.0.1:8000/chat"

# Test conversations for multiple users
conversations = [
    {
        "session_id": "alice123",
        "user_name": "Alice",
        "queries": ["HI", "how are you", "Tell me about Dagi", "What projects?"]
    },
    {
        "session_id": "bob456",
        "user_name": "Bob",
        "queries": ["I’m hiring", "What experience?"]
    }
]

for convo in conversations:
    print(f"\nTesting conversation for {convo['user_name']} (Session ID: {convo['session_id']})")
    for query in convo["queries"]:
        payload = {
            "query": query,
            "session_id": convo["session_id"],
            "user_name": convo["user_name"]
        }
        print(f"\nQuery: {payload['query']}")
        response = requests.post(BASE_URL, json=payload)
        print(f"Status Code: {response.status_code}")
        print(f"Response Data: {response.json()}")
        if response.status_code == 200:
            print(f"Response: {response.json()['response']}")
        else:
            print("Response: Failed - See Response Data for details")