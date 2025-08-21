
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
import logging
import time
import bleach
from backend.ai_core.agent.graph import create_chatbot_graph

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
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
    """
    Handles chat requests by invoking the chatbot graph.
    """
    start_time = time.time()
    logger.info(f"Received chat request from user: {chat_request.user_name}")
    
    try:
        graph = request.app.state.graph
        if graph is None:
            logger.error("Chatbot graph not found in application state.")
            raise HTTPException(status_code=500, detail="Chatbot is not available.")

        # Sanitize the user's message to prevent prompt injection
        sanitized_message = bleach.clean(chat_request.message)

        # Prepare the initial state for the graph
        initial_state = {
            "input": sanitized_message,
            "user_name": chat_request.user_name,
            "history": [hist.dict() for hist in chat_request.history], # Convert Pydantic models to dicts
            "profile": request.app.state.profile, # Pass the profile from the app state
        }

        # Asynchronously invoke the graph with the initial state
        response_state = await graph.ainvoke(initial_state)

        if response_state is None or "response" not in response_state:
            logger.error("Graph invocation returned a null or invalid state.")
            raise HTTPException(status_code=500, detail="Failed to get a valid response from the chatbot.")

        # Extract the final response
        final_response = response_state.get("response", "Sorry, I couldn't process your request.")
        file_url = response_state.get("file_url")
        
        end_time = time.time()
        response_time = end_time - start_time
        logger.info(f"Response generated in {response_time:.2f} seconds.")
        logger.info(f"Sending response to user {chat_request.user_name}: {final_response[:100]}...")
        
        response_payload = {"response": final_response}
        if file_url:
            response_payload["file_url"] = file_url

        return response_payload

    except Exception as e:
        logger.error(f"An unexpected error occurred in the chat endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred.")

@router.get("/health")
async def health_check():
    """
    A simple health check endpoint.
    """
    return {"status": "ok"}
