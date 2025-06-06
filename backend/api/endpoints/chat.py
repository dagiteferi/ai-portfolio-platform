from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.ai_core.agent.graph import create_chatbot_graph
from backend.vector_db.faiss_manager import faiss_manager

router = APIRouter()

class ChatMessage(BaseModel):
    user: str
    assistant: str

class ChatRequest(BaseModel):
    message: str
    user_name: Optional[str] = None
    history: Optional[List[ChatMessage]] = None

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        graph = create_chatbot_graph()
        results = faiss_manager.search_combined(request.message, k=2)
        retrieved_docs = [doc.page_content for doc in results] if results else []
        state = {
            "input": request.message,
            "user_name": request.user_name or "user",
            "history": request.history or [],
            "retrieved_docs": retrieved_docs
        }
        response = await graph.ainvoke(state)
        return {"response": response.get("raw_response", "No response")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")