from langchain_core.documents import Document
import os
import pdfplumber
import json
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

def load_knowledge_base():
    """
    Loads the static knowledge base content as a Document object.
    """
    knowledge_base_content = (
        "STATIC KNOWLEDGE BASE (USE ONLY THESE DETAILS):\n"
        "- Skills: Python (Expert), JavaScript (Advanced), PyTorch, TensorFlow, Scikit-learn, FastAPI, Docker, AWS\n"
        "- Projects:\n"
        "  1. AI Portfolio Platform (2024): Gemini, LangGraph, React; 30% faster deployment; Story: Debugged CSS issues while eating baklava; Purpose: Showcase AI work\n"
        "  2. Fraud Detection @ Black ET (2023): PyTorch, XGBoost; 20% reduction in false positives; Story: 3AM breakthrough with Ethiopian coffee\n"
        "- Experience: AI/ML Engineer at Black ET (2023-2025), AI Engineer intern at Kifiya, 4th-year CS student at Unity University"
    )
    return [Document(page_content=knowledge_base_content, metadata={"source": "knowledge_base", "title": "Static Knowledge Base", "url": ""})]

def load_resume():
    """
    Loads the resume content as a Document object.
    """
    resume_path = os.path.join(os.path.dirname(__file__), "resume.pdf")  # Removed extra 'knowledge/' subdirectory
    logger.info(f"Checking resume at: {resume_path}")
    if os.path.exists(resume_path):
        try:
            with pdfplumber.open(resume_path) as pdf:
                resume_content = ""
                for page in pdf.pages:
                    resume_content += page.extract_text() or ""
        except Exception as e:
            logger.error(f"Error reading PDF resume: {str(e)}")
            resume_content = """
            Name: Dagmawi Teferi
            Summary: An AI/ML Engineer with a strong foundation in Computer Science...
            """
    else:
        logger.warning(f"Resume file not found at: {resume_path}")
        resume_content = """
        Name: Dagmawi Teferi
        Summary: An AI/ML Engineer with a strong foundation in Computer Science...
        """
    return [Document(page_content=resume_content, metadata={"source": "resume", "title": "Resume", "url": ""})]

def load_github_data():
    """
    Loads the GitHub knowledge base content as Document objects.
    """
    github_path = os.path.join(os.path.dirname(__file__), "github_knowledge_base.json")  # Removed extra 'knowledge/' subdirectory
    logger.info(f"Checking GitHub knowledge base at: {github_path}")
    documents = []
    if os.path.exists(github_path):
        try:
            with open(github_path, "r", encoding="utf-8") as f:
                github_data = json.load(f)
            for item in github_data:
                documents.append(Document(
                    page_content=item["content"],
                    metadata={
                        "source": "github",
                        "title": item["title"],
                        "url": item["url"]
                    }
                ))
            logger.info(f"Loaded {len(documents)} GitHub repositories from: {github_path}")
        except Exception as e:
            logger.error(f"Error loading GitHub knowledge base: {str(e)}")
    else:
        logger.warning(f"GitHub knowledge base not found at: {github_path}")
    return documents

def load_static_content(source="all"):
    """
    Loads static content based on the specified source.
    Args:
        source (str): The source to load ("all", "knowledge_base", "resume", or "github"). Defaults to "all".
    Returns:
        List[Document]: List of Document objects containing the content.
    """
    documents = []
    if source == "all":
        documents.extend(load_knowledge_base())
        documents.extend(load_resume())
        documents.extend(load_github_data())
    elif source == "knowledge_base":
        documents.extend(load_knowledge_base())
    elif source == "resume":
        documents.extend(load_resume())
    elif source == "github":
        documents.extend(load_github_data())
    else:
        raise ValueError(f"Unknown source: {source}. Use 'all', 'knowledge_base', 'resume', or 'github'.")
    logger.info(f"Loaded {len(documents)} static documents from source: {source}")
    return documents