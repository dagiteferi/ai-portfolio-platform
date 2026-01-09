#!/usr/bin/env python3
"""
Test script to demonstrate the improved skill creation endpoint.
This shows how placeholder values are now properly converted to NULL.
"""

import requests
import json

BASE_URL = "http://localhost:8011/api"

# First, login to get a token
print("🔐 Logging in...")
login_response = requests.post(
    f"{BASE_URL}/admin/login",
    json={
        "username": "dagitefer[email protected]",
        "password": "your-password-here"  # Update this
    }
)

if login_response.status_code != 200:
    print("❌ Login failed. Please update the credentials in the script.")
    exit(1)

token = login_response.json()["access_token"]
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

print("✅ Login successful!\n")

# Test 1: Create skill with placeholder "string" values
print("📝 Test 1: Creating skill with placeholder 'string' values")
print("Request body:")
test_data_1 = {
    "name": "Python",
    "proficiency": "Expert",
    "category": "string",  # This should become NULL
    "icon": "string"       # This should become NULL
}
print(json.dumps(test_data_1, indent=2))

response_1 = requests.post(
    f"{BASE_URL}/admin/skills",
    headers=headers,
    json=test_data_1
)

print(f"\nResponse ({response_1.status_code}):")
print(json.dumps(response_1.json(), indent=2))
print("\n" + "="*60 + "\n")

# Test 2: Create skill with only required fields
print("📝 Test 2: Creating skill with only required fields (name & proficiency)")
print("Request body:")
test_data_2 = {
    "name": "JavaScript",
    "proficiency": "Advanced"
}
print(json.dumps(test_data_2, indent=2))

response_2 = requests.post(
    f"{BASE_URL}/admin/skills",
    headers=headers,
    json=test_data_2
)

print(f"\nResponse ({response_2.status_code}):")
print(json.dumps(response_2.json(), indent=2))
print("\n" + "="*60 + "\n")

# Test 3: Create skill with proper values
print("📝 Test 3: Creating skill with all proper values")
print("Request body:")
test_data_3 = {
    "name": "React",
    "proficiency": "Expert",
    "category": "Frontend",
    "icon": "https://example.com/react-icon.svg"
}
print(json.dumps(test_data_3, indent=2))

response_3 = requests.post(
    f"{BASE_URL}/admin/skills",
    headers=headers,
    json=test_data_3
)

print(f"\nResponse ({response_3.status_code}):")
print(json.dumps(response_3.json(), indent=2))
print("\n" + "="*60 + "\n")

print("✅ All tests completed!")
print("\n💡 Notice how:")
print("   - In Test 1: 'string' values were converted to null")
print("   - In Test 2: Missing optional fields are null")
print("   - In Test 3: Real values are preserved")
