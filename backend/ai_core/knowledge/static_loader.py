import json
import os
from typing import List, Dict, Tuple
from langchain_core.documents import Document
import logging

logger = logging.getLogger(__name__)

def load_static_content() -> tuple[List[Document], Dict]:
    """
    Loads static content from JSON files and returns a tuple:
    (list of Document objects, profile dictionary).
    """
    documents = []
    profile_data = {}
    knowledge_dir = "backend/ai_core/knowledge"

    for filename in os.listdir(knowledge_dir):
        if filename.endswith(".json"):
            file_path = os.path.join(knowledge_dir, filename)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)

                    if filename == "github_knowledge_base.json":
                        if "profile" in data:
                            profile_data = data["profile"]
                            # Process individual profile fields
                            for key, value in profile_data.items():
                                if key == "education" and isinstance(value, list):
                                    for edu in value:
                                        documents.append(Document(page_content=f"Education: {json.dumps(edu)}", metadata={"source": "profile", "type": "education"}))
                                elif key == "experience" and isinstance(value, list):
                                    for job in value:
                                        end_date = job.get('end_date')
                                        # A job is current if the end date is null or the string "present"
                                        is_current = end_date is None or (isinstance(end_date, str) and end_date.lower() == "present")
                                        
                                        # Combine job info and responsibilities into a single document
                                        responsibilities_text = "\n".join([f"- {resp}" for resp in job.get("responsibilities", [])])
                                        job_content = (
                                            f"Experience: {job.get('title', '')} at {job.get('company', '')} "
                                            f"({job.get('start_date', '')} - {end_date}) in {job.get('location', '')}.\n"
                                            f"Responsibilities:\n{responsibilities_text}"
                                        )
                                        if is_current:
                                            job_content += "\n(Current Role)"

                                        documents.append(Document(
                                            page_content=job_content,
                                            metadata={
                                                "source": "profile", 
                                                "type": "experience", 
                                                "company": job.get('company', ''), 
                                                "title": job.get('title', ''), 
                                                "is_current": is_current
                                            }
                                        ))
                                elif key == "skills" and isinstance(value, str):
                                    documents.append(Document(page_content=f"Skills: {value}", metadata={"source": "profile", "type": "skills"}))
                                elif key == "projects" and isinstance(value, list):
                                    for project in value:
                                        documents.append(Document(page_content=f"Project: {project}", metadata={"source": "profile", "type": "project"}))
                                else:
                                    documents.append(Document(page_content=f"Profile {key}: {value}", metadata={"source": "profile", "type": key}))

                        # Process repositories
                        if "repositories" in data:
                            for repo in data["repositories"]:
                                content = repo.get("content", "").strip()
                                if not content:
                                    content = f"No description available for {repo.get('title', 'Unknown')}."
                                documents.append(Document(
                                    page_content=content,
                                    metadata={"title": repo.get("title", "Unknown"), "url": repo.get("url", ""), "source": "github_repo", "type": "project"}
                                ))

                        # Process recent activity
                        if "recent_activity" in data:
                            for event in data["recent_activity"]:
                                documents.append(Document(
                                    page_content=f"Recent Activity: {event['type']} on {event['repo']} at {event['created_at']}: {event['description']}",
                                    metadata={"source": "github_activity"}
                                ))

                    elif filename == "personal_knowledge_base.json":
                        if "interests" in data:
                            for interest_type, items in data["interests"].items():
                                if interest_type == "books" and isinstance(items, dict):
                                    # Special handling for books to include the comment
                                    book_content = f"Favorite Book: {items.get('favorite_book', '')}"
                                    if "comment" in items:
                                        book_content += f" (Comment: {items['comment']})"
                                    documents.append(Document(page_content=book_content, metadata={"source": "personal_knowledge", "type": interest_type}))
                                elif interest_type == "friends" and isinstance(items, list):
                                    for friend in items:
                                        documents.append(Document(page_content=f"Friend: {friend.get('name')}, Relationship: {friend.get('relationship')}", metadata={"source": "personal_knowledge", "type": "friend"}))
                                elif isinstance(items, list): # This handles hobbies
                                    for item in items:
                                        documents.append(Document(page_content=f"Hobby: {item}", metadata={"source": "personal_knowledge", "type": interest_type}))
                                elif isinstance(items, dict): # This handles spiritual_beliefs
                                    for sub_key, sub_value in items.items():
                                        # Special handling for core_principles which is a list
                                        if sub_key == "core_principles" and isinstance(sub_value, list):
                                            for principle in sub_value:
                                                documents.append(Document(page_content=f"Spiritual Belief - Core Principle: {principle}", metadata={"source": "personal_knowledge", "type": interest_type}))
                                        else:
                                            documents.append(Document(page_content=f"Spiritual Belief - {sub_key}: {sub_value}", metadata={"source": "personal_knowledge", "type": interest_type}))

                        if "work_experience" in data:
                            for job in data["work_experience"]:
                                end_date = job.get('end_date', '')
                                is_current = end_date.lower() == "present" or end_date is None
                                job_content = f"Work Experience: {job.get('title', '')} at {job.get('company', '')} ({job.get('start_date', '')} - {end_date}) in {job.get('location', '')}."
                                if is_current:
                                    job_content += " (Current Role)"
                                documents.append(Document(page_content=job_content, metadata={"source": "personal_knowledge", "type": "work_experience", "company": job.get('company', ''), "title": job.get('title', ''), "is_current": is_current}))
                                if "responsibilities" in job and isinstance(job["responsibilities"], list):
                                    for resp in job["responsibilities"]:
                                        documents.append(Document(page_content=f"Responsibility for {job.get('title', '')} at {job.get('company', '')}: {resp}", metadata={"source": "personal_knowledge", "type": "responsibility", "company": job.get('company', ''), "title": job.get('title', ''), "is_current": is_current}))

                logger.info(f"Processed JSON file: {filename}")
            except Exception as e:
                logger.error(f"Error processing JSON file {filename}: {e}")

    return documents, profile_data
