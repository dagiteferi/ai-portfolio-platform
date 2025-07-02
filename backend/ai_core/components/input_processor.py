import logging
from typing import Dict

logger = logging.getLogger(__name__)

def process_user_input(state: Dict) -> Dict:
    """
    Initializes or normalizes the state at the beginning of a turn.
    Ensures the state is always in a valid format.
    """
    # Ensure state is a dictionary
    if not isinstance(state, dict):
        state = {}

    # Normalize "message" to "input" for consistency
    if "message" in state and "input" not in state:
        state["input"] = state["message"]

    # Set default values for critical state keys, specifically handling None.
    # This prevents TypeErrors if langgraph initializes keys with None.
    if state.get("tokens_used_in_session") is None:
        state["tokens_used_in_session"] = 0
    if state.get("role_confidence") is None:
        state["role_confidence"] = {"visitor": 0.5, "recruiter": 0.5}
    if state.get("history") is None:
        state["history"] = []
    if not state.get("user_name"):
        state["user_name"] = "there"

    logger.info(f"State initialized for user: {state.get('user_name', 'unknown')}")
    return state
