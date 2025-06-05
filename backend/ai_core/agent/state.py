from typing import Dict, List, Optional
from pydantic import BaseModel

from typing import TypedDict

class ChatbotState(TypedDict):
    user_name: str
    session_id: str
    input: str
    history: list
    is_recruiter: bool
    role_confidence: dict
    role_identified: bool
    system_prompt: str
    minimal_prompt: str
    retrieved_docs: list
    raw_response: str
    formatted_response: str
    tokens_used_in_session: int
