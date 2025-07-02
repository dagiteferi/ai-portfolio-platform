import logging
from typing import Dict
from backend.config import RECRUITER_KEYWORDS

logger = logging.getLogger(__name__)

def analyze_user_role(state: Dict) -> Dict:
    """
    Infers the user's role (recruiter or visitor) based on keywords in their input.
    """
    user_input = state.get("input", "").lower()
    role_confidence = state.get("role_confidence") or {"visitor": 0.5, "recruiter": 0.5}

    if any(word in user_input for word in RECRUITER_KEYWORDS):
        role_confidence["recruiter"] += 0.25
    else:
        role_confidence["visitor"] += 0.1

    total = role_confidence["visitor"] + role_confidence["recruiter"]
    if total > 0:
        role_confidence["visitor"] /= total
        role_confidence["recruiter"] /= total

    state["role_confidence"] = role_confidence
    state["is_recruiter"] = role_confidence["recruiter"] > 0.65
    
    logger.info(f"Inferred role: {'Recruiter' if state['is_recruiter'] else 'Visitor'} with confidence: {role_confidence}")
    return state
