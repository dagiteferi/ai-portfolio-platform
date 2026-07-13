import os
from dotenv import load_dotenv


load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
API_PORT = int(os.getenv("PORT", 8001))


# Prefer a fast Flash model; override with LLM_MODEL_NAME in env if needed
LLM_MODEL_NAME = os.getenv("LLM_MODEL_NAME", "gemini-2.5-flash")
LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE", 0.4))
MAX_OUTPUT_TOKENS = int(os.getenv("MAX_OUTPUT_TOKENS", "512"))
MAX_HISTORY_TURNS = int(os.getenv("MAX_HISTORY_TURNS", "4"))

EMBEDDINGS_MODEL_NAME = "all-MiniLM-L6-v2"


FAISS_DOCUMENT_COUNT = 10
FAISS_SEARCH_K = int(os.getenv("FAISS_SEARCH_K", "2"))
MAX_RETRIEVED_DOCS = int(os.getenv("MAX_RETRIEVED_DOCS", "4"))


RECRUITER_KEYWORDS = ["hiring", "recruit", "job", "position", "candidate", "resume", "cv", "opportunity"]
# Keywords that trigger a knowledge base search
SEARCH_KEYWORDS = [
    "project", "experience", "education", "skill", "internship", "contact", "email",
    "background", "kifiya", "unity university", "credit scoring", "fraud detection", "about you", "dagi"
]
# Greetings that should not trigger a search
GREETING_KEYWORDS = [
    "hi", "hello", "hey", "how are you", "good morning", "good afternoon",
    "what's up", "yo", "hola", "greetings",
]
