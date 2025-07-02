from typing import Dict, List, Optional
from pydantic import BaseModel

class ChatState(BaseModel):
    input: str = ""
    is_recruiter: bool = False
    role_identified: bool = False  # ➕ NEW: whether the role is confidently known
    system_prompt: str = ""
    retrieved_docs: List[str] = []
    raw_response: str = ""
    formatted_response: str = ""
    history: List[Dict[str, str]] = []
    continue_conversation: bool = True
    session_id: str
    user_name: Optional[str] = None
