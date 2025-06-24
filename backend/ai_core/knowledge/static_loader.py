import json
import os
from typing import List
from langchain_core.documents import Document
import logging
import time

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('static_loader.log')
    ]
)
logger = logging.getLogger(__name__)

def load_static_content(source: str = "all") -> List[Document]:
    """
    Load static content from JSON files and return a list of Document objects.
    Supports nested GitHub knowledge base structure with profile, repositories, and recent_activity.
    """
    start_time = time.time()
    documents = []
    knowledge_base_path = "backend/ai_core/knowledge/github_knowledge_base.json"

    try:
        if source == "all" and os.path.exists(knowledge_base_path):
            logger.debug(f"Loading knowledge base from {knowledge_base_path}")
            with open(knowledge_base_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Process profile
            if "profile" in data:
                profile_content = (
                    f"# Dagmawi Teferi Profile\n"
                    f"Name: {data['profile'].get('name', 'Unknown')}\n"
                    f"Bio: {data['profile'].get('bio', '')}\n"
                    f"Location: {data['profile'].get('location', '')}\n"
                    f"Followers: {data['profile'].get('followers', 0)}\n"
                    f"Following: {data['profile'].get('following', 0)}\n"
                    f"Public Repos: {data['profile'].get('public_repos', 0)}\n"
                    f"GitHub URL: {data['profile'].get('html_url', '')}\n"
                    f"Created At: {data['profile'].get('created_at', '')}"
                )
                documents.append(Document(
                    page_content=profile_content,
                    metadata={"title": "Dagmawi Teferi Profile", "url": data['profile'].get('html_url', '')}
                ))
                logger.debug("Added profile document")

            # Process repositories
            if "repositories" in data:
                for repo in data["repositories"]:
                    content = repo.get("content", "").strip()
                    if not content:
                        content = f"No description available for {repo.get('title', 'Unknown')}."
                    documents.append(Document(
                        page_content=content,
                        metadata={"title": repo.get("title", "Unknown"), "url": repo.get("url", "")}
                    ))
                logger.debug(f"Added {len(data['repositories'])} repository documents")

            # Process recent activity (optional)
            if "recent_activity" in data:
                activity_content = "# Recent Activity\n" + "\n".join([
                    f"- {event['type']} on {event['repo']} at {event['created_at']}: {event['description']}"
                    for event in data["recent_activity"]
                ])
                documents.append(Document(
                    page_content=activity_content,
                    metadata={"title": "Recent Activity", "url": "https://github.com/dagiteferi"}
                ))
                logger.debug("Added recent activity document")

        else:
            logger.warning(f"No valid source or file not found: {knowledge_base_path}")
            return []

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON: {str(e)}")
        return []
    except Exception as e:
        logger.error(f"Error loading static content: {str(e)}")
        return []

    logger.debug(f"Loaded {len(documents)} documents in {time.time() - start_time:.2f}s")
    return documents