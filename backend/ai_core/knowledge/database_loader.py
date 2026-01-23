import logging
from typing import List
from langchain_core.documents import Document
from backend.database import SessionLocal
from backend.models import sql_models as models
import json

logger = logging.getLogger(__name__)

def load_database_content() -> List[Document]:
    """
    Fetches data from the PostgreSQL database and converts it into LangChain Documents.
    """
    documents = []
    db = SessionLocal()
    
    try:
        # 1. Load Education
        educations = db.query(models.Education).all()
        for edu in educations:
            content = (
                f"Education: {edu.degree} at {edu.institution}. "
                f"Period: {edu.start_date} to {edu.end_date or 'Present'}. "
                f"Description: {edu.description} "
                f"GPA: {edu.gpa}. Highlights: {edu.highlights}. "
                f"Courses: {edu.courses}"
            )
            documents.append(Document(
                page_content=content,
                metadata={"source": "database", "type": "education", "id": edu.id}
            ))

        # 2. Load Experience
        experiences = db.query(models.WorkExperience).all()
        for exp in experiences:
            content = (
                f"Experience: {exp.title} at {exp.company} ({exp.type}). "
                f"Location: {exp.location}. Period: {exp.start_date} to {exp.end_date or 'Present'}. "
                f"Description: {exp.description} "
                f"Achievements: {exp.achievements}. "
                f"Technologies: {exp.technologies}"
            )
            documents.append(Document(
                page_content=content,
                metadata={
                    "source": "database", 
                    "type": "experience", 
                    "id": exp.id,
                    "is_current": exp.is_current,
                    "company": exp.company,
                    "title": exp.title
                }
            ))

        # 3. Load Projects
        projects = db.query(models.Project).all()
        for proj in projects:
            content = (
                f"Project: {proj.title} (Category: {proj.category}). "
                f"Description: {proj.description} "
                f"Technologies: {proj.technologies}. "
                f"GitHub: {proj.github_url}. URL: {proj.project_url}"
            )
            documents.append(Document(
                page_content=content,
                metadata={
                    "source": "database", 
                    "type": "project", 
                    "id": proj.id,
                    "title": proj.title,
                    "is_featured": proj.is_featured
                }
            ))

        # 4. Load Skills
        skills = db.query(models.TechnicalSkill).all()
        for skill in skills:
            content = f"Technical Skill: {skill.name} (Proficiency: {skill.proficiency}%)"
            documents.append(Document(
                page_content=content,
                metadata={"source": "database", "type": "skill", "id": skill.id, "name": skill.name}
            ))

        # 5. Load Certificates
        certs = db.query(models.Certificate).all()
        for cert in certs:
            content = (
                f"Certificate: {cert.title} issued by {cert.issuer} on {cert.date_issued}. "
                f"Description: {cert.description}. URL: {cert.url}"
            )
            documents.append(Document(
                page_content=content,
                metadata={"source": "database", "type": "certificate", "id": cert.id}
            ))

        logger.info(f"Loaded {len(documents)} documents from database.")
        return documents
    except Exception as e:
        logger.error(f"Error loading database content: {e}")
        return []
    finally:
        db.close()
