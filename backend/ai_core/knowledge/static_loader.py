from langchain_core.documents import Document
import os
import pdfplumber

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
    return [Document(page_content=knowledge_base_content, metadata={"source": "knowledge_base"})]

def load_resume():
    """
    Loads the resume content as a Document object.
    """
    resume_path = os.path.join(os.path.dirname(__file__), "resume.pdf")
    if os.path.exists(resume_path):
        try:
            with pdfplumber.open(resume_path) as pdf:
                resume_content = ""
                for page in pdf.pages:
                    resume_content += page.extract_text() or ""
        except Exception as e:
            print(f"Error reading PDF resume: {str(e)}")
            resume_content = """
            Name: Dagmawi Teferi
            Summary: An AI/ML Engineer with a strong foundation in Computer Science...
            """
    else:
        resume_content = """
        Name: Dagmawi Teferi
        Summary: An AI/ML Engineer with a strong foundation in Computer Science...
        """
    return [Document(page_content=resume_content, metadata={"source": "resume"})]

def load_static_content(source="knowledge_base"):
    """
    Loads static content based on the specified source.
    Args:
        source (str): The source to load ("knowledge_base" or "resume"). Defaults to "knowledge_base".
    Returns:
        List[Document]: List of Document objects containing the content.
    """
    documents = []
    if source == "knowledge_base":
        documents.extend(load_knowledge_base())
    elif source == "resume":
        documents.extend(load_resume())
    else:
        raise ValueError(f"Unknown source: {source}. Use 'knowledge_base' or 'resume'.")
    return documents