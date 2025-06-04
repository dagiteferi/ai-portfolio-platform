from typing import Dict, List, Optional
from pydantic import BaseModel

class ChatState(BaseModel):
    """State object for the chatbot's conversation flow."""
    input: str = ""                    # Current user message
    is_recruiter: bool = False         # Inferred role (recruiter or visitor)
    system_prompt: str = ""            # Role-specific system prompt
    retrieved_docs: List[str] = []     # Placeholder for RAG (Phase 2)
    raw_response: str = ""             # Gemini's raw response
    formatted_response: str = ""       # Cleaned response for user
    history: List[Dict[str, str]] = [] # Conversation memory
    continue_conversation: bool = True # Determines if session continues
    session_id: str                    # Unique session identifier
    user_name: Optional[str] = None    # User's name for personalization