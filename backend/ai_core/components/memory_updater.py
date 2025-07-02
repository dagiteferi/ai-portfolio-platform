import logging
from typing import Dict

logger = logging.getLogger(__name__)

def update_conversation_memory(state: Dict) -> Dict:
    """
    Updates the conversation history with the latest turn.
    """
    user_input = state.get("input", "")
    response = state.get("response", "")

    if user_input and response:
        if not isinstance(state.get("history"), list):
            state["history"] = []
        state["history"].append({"user": user_input, "assistant": response})
        state["history"] = state["history"][-5:] # Keep history concise
        logger.info("Conversation history updated.")

    return state
