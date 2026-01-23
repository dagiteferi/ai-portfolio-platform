import os
from dotenv import load_dotenv


load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
API_PORT = int(os.getenv("PORT", 8001))


LLM_MODEL_NAME = os.getenv("LLM_MODEL_NAME", "gemini-2.5-flash")
LLM_TEMPERATURE = float(os.getenv("LLM_TEMPERATURE", 0.6))

EMBEDDINGS_MODEL_NAME = "all-MiniLM-L6-v2"


FAISS_DOCUMENT_COUNT = 10 
FAISS_SEARCH_K = 3


RECRUITER_KEYWORDS = ["hiring", "recruit", "job", "position", "candidate", "resume", "cv", "opportunity"]
# Keywords that trigger a knowledge base search
SEARCH_KEYWORDS = [
    "project", "experience", "education", "skill", "internship", "contact", "email",
    "background", "kifiya", "unity university", "credit scoring", "fraud detection", "about you", "dagi"
]
# Greetings that should not trigger a search
GREETING_KEYWORDS = ["hi", "hello", "hey", "how are you", "good morning", "good afternoon", "what's up"]
