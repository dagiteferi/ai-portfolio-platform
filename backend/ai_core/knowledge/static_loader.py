import csv
import json
import os
from typing import List, Tuple, Dict
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

def load_static_content(source: str = "all") -> Tuple[List[Document], Dict]:
    """
    Load static content from JSON files and return a tuple:
    (list of Document objects, profile dictionary).
    """
    start_time = time.time()
    documents = []
    profile_data = {}
    knowledge_base_path = "backend/ai_core/knowledge/github_knowledge_base.json"
    personal_knowledge_base_path = "backend/ai_core/knowledge/personal_knowledge_base.json"
    data_dir = "backend/data"

    try:
        if source == "all" and os.path.exists(knowledge_base_path):
            logger.debug(f"Loading knowledge base from {knowledge_base_path}")
            with open(knowledge_base_path, 'r', encoding='utf-8') as f:
                data = json.load(f)

            # Process profile
            if "profile" in data:
                profile_data = data["profile"]
                education_str = ""
                if "education" in profile_data and isinstance(profile_data["education"], list):
                    education_str = "\n".join(
                        [
                            f"{edu.get('degree', edu.get('certificate', '') or '')} at {edu.get('institution', '')} ({edu.get('year', '')}), GPA: {edu.get('gpa', '')}"
                            for edu in profile_data["education"]
                        ]
                    )
                profile_content = (
                    f"# Dagmawi Teferi Profile\n"
                    f"Name: {profile_data.get('name', 'Unknown')}\n"
                    f"Bio: {profile_data.get('bio', '')}\n"
                    f"Location: {profile_data.get('location', '')}\n"
                    f"Email: {profile_data.get('email', '')}\n"
                    f"Phone: {profile_data.get('phone', '')}\n"
                    f"LinkedIn: {profile_data.get('linkedin', '')}\n"
                    f"Education:\n{education_str}\n"
                    f"Experience: {profile_data.get('experience', '')}\n"
                    f"Skills: {profile_data.get('skills', '')}\n"
                    f"Certifications: {profile_data.get('certifications', '')}\n"
                    f"Languages: {profile_data.get('languages', '')}\n"
                    f"Awards: {profile_data.get('awards', '')}\n"
                )
                documents.append(Document(
                    page_content=profile_content,
                    metadata={"title": "Dagmawi Teferi Profile", "url": profile_data.get('linkedin', '')}
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

            # Process personal interests
            if os.path.exists(personal_knowledge_base_path):
                logger.debug(f"Loading personal knowledge base from {personal_knowledge_base_path}")
                with open(personal_knowledge_base_path, 'r', encoding='utf-8') as f:
                    personal_data = json.load(f)
                if "interests" in personal_data:
                    interests = personal_data["interests"]
                    if "music" in interests:
                        music_content_lines = ["# Musical Interests"]
                        for artist in interests["music"].get("artists", []):
                            music_content_lines.append(f"## {artist['name']}")
                            if "bio" in artist: music_content_lines.append(f"Bio: {artist['bio']}")
                            if "popular_songs" in artist: music_content_lines.append(f"Popular Songs: {', '.join(artist['popular_songs'])}")
                            if "songs" in artist: music_content_lines.append(f"Favorite Songs: {', '.join(artist['songs'])}")
                            if "playlists" in artist: music_content_lines.append(f"Playlists: {', '.join(artist['playlists'])}")
                        music_content = "\n".join(music_content_lines)
                        documents.append(Document(
                            page_content=music_content,
                            metadata={"title": "Musical Interests"}
                        ))
                        logger.debug("Added musical interests document")

                    if "books" in interests:
                        book_content = "# Reading Interests\n"
                        book_content += f"Favorite Book: {interests['books']['favorite_book']}\n"
                        book_content += f"Comment: {interests['books']['comment']}\n"
                        documents.append(Document(
                            page_content=book_content,
                            metadata={"title": "Reading Interests"}
                        ))
                        logger.debug("Added reading interests document")

                    if "hobbies" in interests:
                        hobbies_content = "# Hobbies\n"
                        hobbies_content += ", ".join(interests['hobbies'])
                        documents.append(Document(
                            page_content=hobbies_content,
                            metadata={"title": "Hobbies"}
                        ))
                        logger.debug("Added hobbies document")

                    if "friends" in interests:
                        friends_content = "# Friends\n"
                        for friend in interests["friends"]:
                            friends_content += f"- {friend['name']} ({friend['relationship']})\n"
                        documents.append(Document(
                            page_content=friends_content,
                            metadata={"title": "Friends"}
                        ))
                        logger.debug("Added friends document")

                    if "spiritual_beliefs" in interests:
                        spiritual_content = "# Spiritual Beliefs\n"
                        spiritual_content += f"Faith: {interests['spiritual_beliefs']['faith']}\n"
                        spiritual_content += "Core Principles:\n"
                        for principle in interests['spiritual_beliefs']['core_principles']:
                            spiritual_content += f"- {principle}\n"
                        documents.append(Document(
                            page_content=spiritual_content,
                            metadata={"title": "Spiritual Beliefs"}
                        ))
                        logger.debug("Added spiritual beliefs document")

            

        else:
            logger.warning(f"No valid source or file not found: {knowledge_base_path}")
            return [], {}

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON: {str(e)}")
        return [], {}
    except Exception as e:
        logger.error(f"Error loading static content: {str(e)}")
        return [], {}

    logger.debug(f"Loaded {len(documents)} documents in {time.time() - start_time:.2f}s")
    return documents, profile_data
