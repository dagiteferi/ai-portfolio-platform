import logging
from typing import List, Optional, Any
from langchain_core.documents import Document
from backend.database import SessionLocal
from backend.models import sql_models as models

logger = logging.getLogger(__name__)

# Map ORM class -> RAG metadata type
MODEL_TO_DOC_TYPE = {
    models.Education: "education",
    models.WorkExperience: "experience",
    models.Project: "project",
    models.TechnicalSkill: "skills",
    models.Certificate: "certificate",
    models.MemorableMoment: "moment",
}

DOC_TYPE_TO_MODEL = {v: k for k, v in MODEL_TO_DOC_TYPE.items()}


def make_doc_id(doc_type: str, row_id: int) -> str:
    return f"db:{doc_type}:{row_id}"


def education_to_document(edu: models.Education) -> Document:
    content = (
        f"Education: {edu.degree} at {edu.institution}. "
        f"Period: {edu.start_date} to {edu.end_date or 'Present'}. "
        f"Description: {edu.description} "
        f"GPA: {edu.gpa}. Highlights: {edu.highlights}. "
        f"Courses: {edu.courses}"
    )
    return Document(
        page_content=content,
        metadata={"source": "database", "type": "education", "id": edu.id},
    )


def experience_to_document(exp: models.WorkExperience) -> Document:
    content = (
        f"Experience: {exp.title} at {exp.company} ({exp.type}). "
        f"Location: {exp.location}. Period: {exp.start_date} to {exp.end_date or 'Present'}. "
        f"Description: {exp.description} "
        f"Achievements: {exp.achievements}. "
        f"Technologies: {exp.technologies}"
    )
    return Document(
        page_content=content,
        metadata={
            "source": "database",
            "type": "experience",
            "id": exp.id,
            "is_current": exp.is_current,
            "company": exp.company,
            "title": exp.title,
        },
    )


def project_to_document(proj: models.Project) -> Document:
    content = (
        f"Project: {proj.title} (Category: {proj.category}). "
        f"Description: {proj.description} "
        f"Technologies: {proj.technologies}. "
        f"GitHub: {proj.github_url}. URL: {proj.project_url}"
    )
    return Document(
        page_content=content,
        metadata={
            "source": "database",
            "type": "project",
            "id": proj.id,
            "title": proj.title,
            "is_featured": proj.is_featured,
        },
    )


def skill_to_document(skill: models.TechnicalSkill) -> Document:
    content = (
        f"Technical Skill: {skill.name} "
        f"(Category: {skill.category}, Proficiency: {skill.proficiency})"
    )
    return Document(
        page_content=content,
        metadata={
            "source": "database",
            "type": "skills",
            "id": skill.id,
            "name": skill.name,
        },
    )


def certificate_to_document(cert: models.Certificate) -> Document:
    content = (
        f"Certificate: {cert.title} issued by {cert.issuer} on {cert.date_issued}. "
        f"Description: {cert.description}. URL: {cert.url}. "
        f"Professional: {cert.is_professional}"
    )
    return Document(
        page_content=content,
        metadata={"source": "database", "type": "certificate", "id": cert.id},
    )


def moment_to_document(moment: models.MemorableMoment) -> Document:
    content = (
        f"Memorable Moment: {moment.title}. "
        f"Date: {moment.date}. "
        f"Description: {moment.description}"
    )
    return Document(
        page_content=content,
        metadata={
            "source": "database",
            "type": "moment",
            "id": moment.id,
            "title": moment.title,
        },
    )


_CONVERTERS = {
    models.Education: education_to_document,
    models.WorkExperience: experience_to_document,
    models.Project: project_to_document,
    models.TechnicalSkill: skill_to_document,
    models.Certificate: certificate_to_document,
    models.MemorableMoment: moment_to_document,
}


def row_to_document(obj: Any) -> Optional[Document]:
    converter = _CONVERTERS.get(type(obj))
    if not converter:
        return None
    return converter(obj)


def doc_type_for_model(model_cls) -> Optional[str]:
    return MODEL_TO_DOC_TYPE.get(model_cls)


def load_entity_document(doc_type: str, row_id: int) -> Optional[Document]:
    """Load a single DB row as a Document (one query). Used for CDC incremental updates."""
    model_cls = DOC_TYPE_TO_MODEL.get(doc_type)
    if not model_cls:
        return None

    db = SessionLocal()
    try:
        row = db.query(model_cls).filter(model_cls.id == row_id).first()
        if not row:
            return None
        return row_to_document(row)
    except Exception as e:
        logger.error(f"Failed to load {doc_type}:{row_id}: {e}")
        return None
    finally:
        db.close()


def load_database_content() -> List[Document]:
    """
    Fetches portfolio data from PostgreSQL and converts it into LangChain Documents.
    """
    documents: List[Document] = []
    db = SessionLocal()

    try:
        for edu in db.query(models.Education).all():
            documents.append(education_to_document(edu))

        for exp in db.query(models.WorkExperience).all():
            documents.append(experience_to_document(exp))

        for proj in db.query(models.Project).all():
            documents.append(project_to_document(proj))

        for skill in db.query(models.TechnicalSkill).all():
            documents.append(skill_to_document(skill))

        for cert in db.query(models.Certificate).all():
            documents.append(certificate_to_document(cert))

        for moment in db.query(models.MemorableMoment).all():
            documents.append(moment_to_document(moment))

        logger.info(f"Loaded {len(documents)} documents from database.")
        return documents
    except Exception as e:
        logger.error(f"Error loading database content: {e}")
        return []
    finally:
        db.close()
