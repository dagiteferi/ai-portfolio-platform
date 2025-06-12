import requests
import logging
import base64
import json
import os
from datetime import datetime

# === Configuration ===
GITHUB_USERNAME = "dagiteferi"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")  # or paste token directly here for testing
GITHUB_API_BASE = "https://api.github.com"
REQUEST_TIMEOUT = 30  # Increase timeout to avoid disconnects

# === Headers ===
HEADERS = {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": f"token {GITHUB_TOKEN}" if GITHUB_TOKEN else None
}

# === Logging ===
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] - %(message)s")

# === Fetch GitHub Profile ===
def get_profile(username):
    url = f"{GITHUB_API_BASE}/users/{username}"
    logging.info(f"Fetching profile info for: {username}")
    try:
        response = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        logging.error(f"Timeout while fetching profile for: {username}")
    except Exception as e:
        logging.error(f"Failed to fetch profile for {username}: {e}")
    return {}

# === Fetch Repositories ===
def get_repositories(username):
    url = f"{GITHUB_API_BASE}/users/{username}/repos"
    logging.info(f"Fetching repositories for user: {username}")
    try:
        response = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.Timeout:
        logging.error(f"Timeout while fetching repositories for: {username}")
    except Exception as e:
        logging.error(f"Failed to fetch repositories: {e}")
    return []

# === Fetch README ===
def get_readme(username, repo_name):
    url = f"{GITHUB_API_BASE}/repos/{username}/{repo_name}/readme"
    try:
        response = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        if response.status_code == 200:
            data = response.json()
            if "content" in data:
                return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
        else:
            logging.warning(f"No README found for: {repo_name} (status: {response.status_code})")
    except requests.exceptions.Timeout:
        logging.error(f"Timeout while fetching README for: {repo_name}")
    except Exception as e:
        logging.error(f"Error fetching README for {repo_name}: {e}")
    return ""

# === Fetch Recent Activity ===
def get_recent_activity(username):
    url = f"{GITHUB_API_BASE}/users/{username}/events/public"
    logging.info(f"Fetching recent activity for: {username}")
    try:
        response = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        events = response.json()
        processed_events = []
        for event in events:
            description = ""
            if event["type"] == "PushEvent":
                commit_count = len(event.get("payload", {}).get("commits", []))
                description = f"Pushed {commit_count} commits"
            elif event["type"] == "CreateEvent":
                description = f"Created {event['payload'].get('ref_type', 'something')}"
            elif event["type"] == "ForkEvent":
                description = "Forked repository"
            else:
                description = event["type"]

            processed_events.append({
                "type": event["type"],
                "repo": event["repo"]["name"],
                "created_at": event["created_at"],
                "description": description
            })
        return processed_events
    except requests.exceptions.Timeout:
        logging.error(f"Timeout while fetching activity for: {username}")
    except Exception as e:
        logging.error(f"Failed to fetch recent activity: {e}")
    return []

# === Build Full Profile ===
def build_full_profile(username):
    profile_data = get_profile(username)
    if not profile_data:
        logging.error("Failed to retrieve profile.")
        return {}

    repos = get_repositories(username)
    processed_repos = []
    for repo in repos:
        try:
            processed_repos.append({
                "title": repo.get("name"),
                "url": repo.get("html_url"),
                "content": get_readme(username, repo.get("name"))
            })
            logging.info(f"[+] Processed repo: {repo.get('name')}")
        except Exception as e:
            logging.error(f"Failed to process repository '{repo.get('name')}': {e}")

    activity = get_recent_activity(username)

    return {
        "profile": {
            "name": profile_data.get("name"),
            "bio": profile_data.get("bio"),
            "location": profile_data.get("location"),
            "followers": profile_data.get("followers"),
            "following": profile_data.get("following"),
            "public_repos": profile_data.get("public_repos"),
            "html_url": profile_data.get("html_url"),
            "avatar_url": profile_data.get("avatar_url"),
            "created_at": profile_data.get("created_at"),
        },
        "repositories": processed_repos,
        "recent_activity": activity
    }

# === Main Runner ===
if __name__ == "__main__":
    logging.info("=== GitHub Full Profile Scraper Started ===")
    result = build_full_profile(GITHUB_USERNAME)
    if result:
        output_file = f"{GITHUB_USERNAME}_github_profile.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(result, f, indent=4, ensure_ascii=False)
        logging.info(f"✅ GitHub profile data saved to {output_file}")
    else:
        logging.error("❌ Failed to fetch GitHub profile data")
