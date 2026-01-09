import logging
from typing import Dict
import json
import os
from datetime import datetime

logger = logging.getLogger(__name__)

def _log_chat_history(log_entry: Dict):
    """Appends a chat log entry to the history file."""
    log_dir = "logs"
    os.makedirs(log_dir, exist_ok=True)
    file_path = os.path.join(log_dir, "chat_history.jsonl")
    try:
        with open(file_path, 'a', encoding='utf-8') as f:
            f.write(json.dumps(log_entry) + '\n')
    except Exception as e:
        logger.error(f"Failed to write to chat history log: {e}")

def update_conversation_memory(state: Dict) -> Dict:
    """
    Updates the conversation history with the latest turn and logs it to a file.
    """
    user_input = state.get("input", "")
    response = state.get("response", "")
    user_name = state.get("user_name", "anonymous")

    if user_input and response:
        # Update in-memory history for the current request context
        if not isinstance(state.get("history"), list):
            state["history"] = []
        state["history"].append({"user": user_input, "assistant": response})
        state["history"] = state["history"][-5:] # Keep history concise
        logger.info("In-memory conversation history updated.")

        # Log the turn to a persistent file for admin review
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "user_name": user_name,
            "user_input": user_input,
            "ai_response": response
        }
        _log_chat_history(log_entry)

    return state