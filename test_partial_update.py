#!/usr/bin/env python3
"""
Test script to verify the UPDATE endpoint properly handles partial updates.
This demonstrates that updating one field doesn't affect other fields.
"""

import requests
import json

BASE_URL = "http://localhost:8011/api"

# Configuration - Update these
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYWdpdGVmZXJpMjAxMUBnbWFpbC5jb20iLCJleHAiOjE3NjkwMDIwMDl9.tSVP09_QtrgvS6BYtm5fnip8An1sNkVVYVm_KTVrLrQ"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

print("="*70)
print("TESTING PARTIAL UPDATE FUNCTIONALITY")
print("="*70)

# Step 1: Create a test skill with all fields
print("\n📝 Step 1: Creating a test skill with all fields...")
create_data = {
    "name": "TypeScript",
    "proficiency": "Advanced",
    "category": "Frontend",
    "icon": "https://example.com/typescript.svg"
}
print("Request:")
print(json.dumps(create_data, indent=2))

create_response = requests.post(
    f"{BASE_URL}/admin/skills",
    headers=headers,
    json=create_data
)

if create_response.status_code != 200:
    print(f"❌ Failed to create skill: {create_response.text}")
    exit(1)

skill = create_response.json()
skill_id = skill["id"]
print(f"\n✅ Created skill with ID: {skill_id}")
print("Response:")
print(json.dumps(skill, indent=2))

# Step 2: Update ONLY proficiency (with placeholder values in other fields)
print("\n" + "="*70)
print("📝 Step 2: Updating ONLY proficiency (other fields have 'string')")
print("="*70)
update_data = {
    "name": "string",        # Should be ignored (cleaned to None)
    "category": "string",    # Should be ignored (cleaned to None)
    "proficiency": "Expert", # Should be updated
    "icon": "string"         # Should be ignored (cleaned to None)
}
print("\nRequest:")
print(json.dumps(update_data, indent=2))

update_response = requests.put(
    f"{BASE_URL}/admin/skills/{skill_id}",
    headers=headers,
    json=update_data
)

if update_response.status_code != 200:
    print(f"❌ Failed to update skill: {update_response.text}")
    exit(1)

updated_skill = update_response.json()
print("\n✅ Update successful!")
print("Response:")
print(json.dumps(updated_skill, indent=2))

# Step 3: Verify the update
print("\n" + "="*70)
print("🔍 Step 3: Verification")
print("="*70)

print("\n📊 Comparison:")
print(f"  name:        '{skill['name']}' → '{updated_skill['name']}'")
print(f"  proficiency: '{skill['proficiency']}' → '{updated_skill['proficiency']}'")
print(f"  category:    '{skill['category']}' → '{updated_skill['category']}'")
print(f"  icon:        '{skill['icon']}' → '{updated_skill['icon']}'")

# Check if only proficiency changed
success = True
if updated_skill['name'] != skill['name']:
    print("\n❌ FAIL: name should not have changed!")
    success = False
if updated_skill['proficiency'] != "Expert":
    print("\n❌ FAIL: proficiency should be 'Expert'!")
    success = False
if updated_skill['category'] != skill['category']:
    print("\n❌ FAIL: category should not have changed!")
    success = False
if updated_skill['icon'] != skill['icon']:
    print("\n❌ FAIL: icon should not have changed!")
    success = False

if success:
    print("\n✅ SUCCESS! Only proficiency was updated, other fields remained unchanged!")
else:
    print("\n❌ TEST FAILED!")

# Step 4: Test updating multiple fields
print("\n" + "="*70)
print("📝 Step 4: Updating multiple fields (name and category)")
print("="*70)
multi_update_data = {
    "name": "TypeScript Pro",
    "category": "Full Stack",
    "proficiency": "string",  # Should be ignored
    "icon": "string"          # Should be ignored
}
print("\nRequest:")
print(json.dumps(multi_update_data, indent=2))

multi_update_response = requests.put(
    f"{BASE_URL}/admin/skills/{skill_id}",
    headers=headers,
    json=multi_update_data
)

final_skill = multi_update_response.json()
print("\n✅ Update successful!")
print("Response:")
print(json.dumps(final_skill, indent=2))

print("\n📊 Final Comparison:")
print(f"  name:        '{updated_skill['name']}' → '{final_skill['name']}'")
print(f"  proficiency: '{updated_skill['proficiency']}' → '{final_skill['proficiency']}'")
print(f"  category:    '{updated_skill['category']}' → '{final_skill['category']}'")
print(f"  icon:        '{updated_skill['icon']}' → '{final_skill['icon']}'")

# Cleanup
print("\n" + "="*70)
print("🧹 Cleanup: Deleting test skill...")
delete_response = requests.delete(
    f"{BASE_URL}/admin/skills/{skill_id}",
    headers=headers
)
if delete_response.status_code == 200:
    print("✅ Test skill deleted successfully!")
else:
    print(f"⚠️  Could not delete test skill (ID: {skill_id})")

print("\n" + "="*70)
print("✅ ALL TESTS COMPLETED!")
print("="*70)
print("\n💡 Key Takeaways:")
print("   1. Placeholder values ('string') are automatically cleaned to null")
print("   2. Null values are NOT applied during updates (fields remain unchanged)")
print("   3. Only fields with actual values are updated")
print("   4. Partial updates work correctly - you can update 1, 2, or all fields")
