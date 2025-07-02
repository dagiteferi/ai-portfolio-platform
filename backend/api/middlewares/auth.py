from fastapi import Request
from backend.vector_db.faiss_manager import faiss_manager

async def auth_middleware(request: Request, call_next):
    user_input = request.query_params.get("message", "")
    results = faiss_manager.search(user_input)  # Problematic call
    response = await call_next(request)
    return response