from langchain_core.documents import Document
import os
import pdfplumber
import json
from pathlib import Path
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(), logging.FileHandler('loader.log')]
)
logger = logging.getLogger(__name__)

def load_knowledge_base():
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
    resume_path = os.path.join(os.path.dirname(__file__), "resume.pdf")
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
    github_path = os.path.join(os.path.dirname(__file__), "github_knowledge_base.json")
    logger.info(f"Checking GitHub knowledge base at: {github_path}")
    documents = []
    if os.path.exists(github_path):
        try:
            with open(github_path, "r", encoding="utf-8") as f:
                github_data = json.load(f)
            if not isinstance(github_data, list):
                logger.warning(f"GitHub data is not a list: {type(github_data)}. Converting to list.")
                if isinstance(github_data, dict):
                    github_data = list(github_data.values())
                else:
                    logger.error(f"Cannot convert GitHub data to list: {github_data}")
                    return documents
            for item in github_data:
                if not isinstance(item, dict):
                    logger.warning(f"Skipping invalid GitHub item (not a dict): {item}")
                    continue
                if "content" not in item or "title" not in item or "url" not in item:
                    logger.warning(f"Skipping invalid GitHub item (missing fields): {item}")
                    continue
                documents.append(Document(
                    page_content=str(item["content"]),
                    metadata={
                        "source": "github",
                        "title": str(item["title"]),
                        "url": str(item["url"])
                    }
                ))
            logger.info(f"Loaded {len(documents)} GitHub repositories from: {github_path}")
        except Exception as e:
            logger.error(f"Error loading GitHub knowledge base: {str(e)}")
    else:
        logger.warning(f"GitHub knowledge base not found at: {github_path}")
    return documents

def load_static_content(source="all"):
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
        raise ValueError(f"Unknown source: {source}")
    logger.info(f"Loaded {len(documents)} static documents from source: {source}")
    return documents