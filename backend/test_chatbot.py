import requests

def test_chatbot():
    """Tests the chatbot by sending sample queries."""
    url = "http://localhost:8000/chat"
    payloads = [
        {
            "query": "Tell me about Dagi's AI skills",
            "session_id": "test123",
            "user_name": "Alice"
        },
        {
            "query": "Who is Dagi?",
            "session_id": "test123",
            "user_name": "Bob"
        }
    ]
    for payload in payloads:
        try:
            response = requests.post(url, json=payload, timeout=10)
            response.raise_for_status()  # Raise an error for bad status codes
            data = response.json()
            print(f"Query: {payload['query']}")
            print(f"Status Code: {response.status_code}")
            print(f"Response Data: {data}")
            print(f"Response: {data.get('response', 'No response key in data')}\n")
        except requests.exceptions.HTTPError as e:
            print(f"Query: {payload['query']}")
            print(f"HTTP Error: {e.response.status_code} - {e.response.text}\n")
        except requests.exceptions.RequestException as e:
            print(f"Query: {payload['query']}")
            print(f"Request Error: {str(e)}\n")
        except Exception as e:
            print(f"Query: {payload['query']}")
            print(f"General Error: {str(e)}\n")

if __name__ == "__main__":
    test_chatbot()