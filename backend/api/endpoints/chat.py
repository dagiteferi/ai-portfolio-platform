import logging
import time
import bleach
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from backend.ai_core.agent.graph import create_chatbot_graph

logger = logging.getLogger(__name__)
router = APIRouter()

class ChatMessage(BaseModel):
    user: str
    assistant: str

class ChatRequest(BaseModel):
    message: str
    user_name: Optional[str] = "there"
    history: Optional[List[ChatMessage]] = []

@router.post("/chat")
async def chat_endpoint(request: Request, chat_request: ChatRequest):
    start_time = time.time()
    logger.info(f"Received chat request from user: {chat_request.user_name}")
    
    try:
        graph = request.app.state.graph
        if graph is None:
            logger.error("Chatbot graph not found in application state.")
            raise HTTPException(status_code=500, detail="Chatbot is not available.")

        sanitized_message = bleach.clean(chat_request.message)

        initial_state = {
            "input": sanitized_message,
            "user_name": chat_request.user_name,
            "history": [hist.dict() for hist in chat_request.history],
            "profile": request.app.state.profile,
        }

        response_state = await graph.ainvoke(initial_state)

        if response_state is None or "response" not in response_state:
            logger.error("Graph invocation returned a null or invalid state.")
            raise HTTPException(status_code=500, detail="Failed to get a valid response from the chatbot.")

        final_response = response_state.get("response", "Sorry, I couldn't process your request.")
        file_url = response_state.get("file_url")
        
        end_time = time.time()
        response_time = end_time - start_time
        logger.info(f"Response generated in {response_time:.2f} seconds.")
        
        response_payload = {"response": final_response}
        if file_url:
            response_payload["file_url"] = file_url

        return response_payload

    except Exception as e:
        logger.error(f"An unexpected error occurred in the chat endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
