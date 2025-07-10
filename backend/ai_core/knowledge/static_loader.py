import json
import os
from typing import List, Dict
from langchain_core.documents import Document
import logging

logger = logging.getLogger(__name__)

def load_all_json_files() -> List[Document]:
    """
    Loads all JSON files from the knowledge directory and returns a list of Document objects.
    """
    documents = []
    knowledge_dir = "/home/dagi/Documents/ai-portfolio-platform/backend/ai_core/knowledge"

    for filename in os.listdir(knowledge_dir):
        if filename.endswith(".json"):
            file_path = os.path.join(knowledge_dir, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if filename == "github_knowledge_base.json":
                        # Process repositories
                        if "repositories" in data:
                            for repo in data["repositories"]:
                                content = repo.get("content", "").strip()
                                if not content:
                                    content = f"No description available for {repo.get('title', 'Unknown')}."
                                documents.append(Document(
                                    page_content=content,
                                    metadata={"title": repo.get("title", "Unknown"), "url": repo.get("url", ""), "source": filename}
                                ))
                    elif filename == "personal_knowledge_base.json":
                        if "interests" in data:
                            interests = data["interests"]
                            for key, value in interests.items():
                                documents.append(Document(page_content=f"{key}: {json.dumps(value, indent=2)}", metadata={"source": filename}))

                logger.info(f"Loaded JSON file: {filename}")
            except Exception as e:
                logger.error(f"Error loading JSON file {filename}: {e}")

    return documents

def load_profile_data() -> Dict:
    """
    Loads the profile data from the github_knowledge_base.json file.
    """
    profile_data = {}
    knowledge_base_path = "/home/dagi/Documents/ai-portfolio-platform/backend/ai_core/knowledge/github_knowledge_base.json"

    try:
        if os.path.exists(knowledge_base_path):
            with open(knowledge_base_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                if "profile" in data:
                    profile_data = data["profile"]
    except Exception as e:
        logger.error(f"Error loading profile data: {e}")

    return profile_data
