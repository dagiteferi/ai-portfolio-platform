from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.ai_core.agent.graph import create_chatbot_graph
from backend.vector_db.faiss_manager import faiss_manager
# from backend.main import app
from fastapi import APIRouter, HTTPException, Request
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(), logging.FileHandler('chat.log')]
)
logger = logging.getLogger(__name__)

router = APIRouter()

class ChatMessage(BaseModel):
    user: str
    assistant: str

class ChatRequest(BaseModel):
    message: str
    user_name: Optional[str] = None
    history: Optional[List[ChatMessage]] = None



@router.post("/chat")
async def chat_endpoint(request: Request, chat: ChatRequest):
    logger.info(f"Received chat request from {chat.user_name or 'user'}: {chat.message}")
    try:
        graph = create_chatbot_graph()
        if graph is None:
            logger.error("Failed to create chatbot graph")
            raise ValueError("Chatbot graph initialization failed")

        results = faiss_manager.search_combined(chat.message, k=2)
        if results is None:
            logger.warning("FAISS search returned None; using empty retrieved docs")
            retrieved_docs = []
        else:
            retrieved_docs = [doc.page_content for doc in results]

        # Access profile from app state via request
        profile = request.app.state.profile

        state = {
            "input": chat.message,
            "user_name": chat.user_name or "user",
            "history": chat.history or [],
            "retrieved_docs": retrieved_docs,
            "profile": profile
        }
        response = await graph.ainvoke(state)
        if response is None:
            logger.error("Graph invocation returned None")
            raise ValueError("No response from chatbot graph")

        response_text = response.get("raw_response", "No response")
        logger.info(f"Chat response: {response_text[:100]}...")
        return {"response": response_text}
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")