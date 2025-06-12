import requests
import json
import base64
from dotenv import load_dotenv
import os
import logging

# === Setup Logging ===
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("github_scraper.log"),
        logging.StreamHandler()
    ]
)

# === Load environment variables ===
load_dotenv()
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
OUTPUT_FILE = "github_knowledge_base.json"

# === Check credentials ===
if not GITHUB_USERNAME or not GITHUB_TOKEN:
    logging.error("Missing GitHub credentials in .env file.")
    exit(1)

# === Headers with Authorization ===
headers = {
    "Accept": "application/vnd.github.v3+json",
    "Authorization": f"token {GITHUB_TOKEN}"
}

# === Fetch all repositories ===
def get_repositories(username):
    url = f"https://api.github.com/users/{username}/repos?per_page=100"
    logging.info(f"Fetching repositories for user: {username}")
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        logging.error(f"Failed to fetch repositories: {response.text}")
        raise Exception(f"GitHub API error: {response.status_code}")
    repos = response.json()
    logging.info(f"Found {len(repos)} repositories.")
    return repos

# === Fetch README for each repository ===
def get_readme(username, repo_name):
    url = f"https://api.github.com/repos/{username}/{repo_name}/readme"
    logging.debug(f"Fetching README for: {repo_name}")
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        if "content" in data:
            return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
    else:
        logging.warning(f"No README found for: {repo_name} (status: {response.status_code})")
    return ""

# === Build knowledge base from repositories ===
def build_knowledge_base(username):
    repos = get_repositories(username)
    knowledge = []

    for repo in repos:
        try:
            title = repo["name"]
            url = repo["html_url"]
            description = repo.get("description", "")
            readme = get_readme(username, title)
            content = f"{description}\n\nREADME:\n{readme}" if readme else description

            knowledge.append({
                "title": title,
                "url": url,
                "content": content.strip()
            })

            logging.info(f"[+] Processed repo: {title}")
        except Exception as e:
            logging.error(f"Failed to process repository '{repo['name']}': {e}")

    return knowledge

# === Save to JSON ===
def save_to_json(data, filename):
    logging.info(f"Saving knowledge base to: {filename}")
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        logging.info("✅ JSON file saved successfully.")
    except Exception as e:
        logging.error(f"Failed to save JSON file: {e}")

# === Run the script ===
if __name__ == "__main__":
    logging.info("=== GitHub Scraper Started ===")
    kb = build_knowledge_base(GITHUB_USERNAME)
    save_to_json(kb, OUTPUT_FILE)
    logging.info("=== GitHub Scraper Completed ===")
