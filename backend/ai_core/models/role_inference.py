from backend.vector_db.faiss_manager import faiss_manager

def infer_role(user_input: str) -> str:
    results = faiss_manager.search_combined(user_input, k=1)  # Updated to search_combined
    if "hiring" in user_input.lower() or any("recruit" in doc.page_content.lower() for doc in results):
        return "recruiter"
    return "visitor"