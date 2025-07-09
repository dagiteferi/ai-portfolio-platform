import os
import requests
import pandas as pd
from langchain_core.documents import Document
from backend.ai_core.utils.logger import log_interaction
import time

def load_github_data() -> list[Document]:
    start_time = time.time()
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        log_interaction("Error", "GITHUB_TOKEN not set")
        return []

    username = "dagiteferi"  # Replace with your GitHub username
    url = f"https://api.github.com/users/{username}/repos?sort=updated&per_page=5"  # Top 5 recent repos
    headers = {"Authorization": f"token {token}"}

    try:
        api_start = time.time()
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        repos = response.json()
        api_end = time.time()
        log_interaction("GitHub API fetch time", f"{api_end - api_start:.2f} seconds")

        documents = []
        for repo in repos:
            content = f"Project: {repo['name']} (Updated: {repo['updated_at']})\n"
            content += f"Description: {repo.get('description', 'No description')}\n"
            content += f"Languages: {', '.join(get_repo_languages(repo['languages_url'], token))}\n"
            documents.append(Document(page_content=content, metadata={"source": "github"}))
        end_time = time.time()
        log_interaction("GitHub data loaded", f"Total repos: {len(documents)}, Time: {end_time - start_time:.2f} seconds")
        return documents
    except requests.RequestException as e:
        log_interaction("Error fetching GitHub data", str(e))
        return []

def get_repo_languages(languages_url: str, token: str) -> list[str]:
    try:
        response = requests.get(languages_url, headers={"Authorization": f"token {token}"})
        response.raise_for_status()
        return list(response.json().keys())
    except requests.RequestException:
        return []

def load_csv_data(file_path: str) -> list[Document]:
    start_time = time.time()
    try:
        df = pd.read_csv(file_path)
        documents = []
        for index, row in df.iterrows():
            if 'top_10_chats_and_senders.csv' in file_path:
                content = f"""Chat Entry:
Chat ID: {row.get('chat_title', 'N/A')}
Sender: {row.get('sender_name', 'N/A')}
Message Count: {row.get('chat_message_count', 'N/A')}"""
            else:
                content = ", ".join([f"{col}: {row[col]}" for col in df.columns])
            documents.append(Document(page_content=content, metadata={"source": file_path}))
        end_time = time.time()
        log_interaction("CSV data loaded", f"File: {file_path}, Rows: {len(documents)}, Time: {end_time - start_time:.2f} seconds")
        return documents
    except Exception as e:
        log_interaction("Error loading CSV data", f"File: {file_path}, Error: {str(e)}")
        return []