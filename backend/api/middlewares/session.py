from fastapi import Request
from backend.vector_db.faiss_manager import faiss_manager

async def session_middleware(request: Request, call_next):
    session_id = request.headers.get("session-id", "")
    results = faiss_manager.search(session_id)  # Problematic call
    response = await call_next(request)
    return response