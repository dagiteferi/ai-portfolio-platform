import re
import logging
from typing import Dict
from backend.ai_core.models.gemini import GeminiClient
from backend.ai_core.utils.prompt_templates import get_system_prompt
from backend.config import LLM_TEMPERATURE

logger = logging.getLogger(__name__)

def format_links(text: str) -> str:
    """
    Finds URLs in a string and formats them as Markdown links.
    """
    url_pattern = re.compile(r'(https?://[\S]+)')
    return url_pattern.sub(r'[\1](\1)', text)

def generate_ai_response(state: Dict) -> Dict:
    """
    Generates a response using the Gemini model based on the user's input, role, and retrieved context.
    """
    user_input = state.get("input", "")
    user_name = state.get("user_name", "there")
    retrieved_docs = state.get("retrieved_docs", [])
    is_recruiter = state.get("is_recruiter", False)
    history = state.get("history", [])

    try:
        role = "recruiter" if is_recruiter else "visitor"
        
        # The improved system prompt now handles all cases, so no special logic is needed here.
        system_prompt = get_system_prompt(role, user_name, retrieved_docs)
        
        gemini = GeminiClient(temperature=LLM_TEMPERATURE)

        response_text = gemini.generate_response(system_prompt, history, user_input)
        
        if "[SEND_CV]" in response_text:
            response_text = response_text.replace("[SEND_CV]", "").strip()
            state["file_url"] = "/assets/Dagmawi Teferi's cv.pdf"
            logger.info(f"CV request detected via token. Attaching CV url to response.")

        state["response"] = format_links(response_text)
        
        logger.info(f"Generated response for {user_name}: {response_text[:100]}...")

    except Exception as e:
        logger.error(f"Error during response generation: {e}", exc_info=True)
        state["response"] = "I'm sorry, but I encountered an error while trying to generate a response. Could you please try asking again?"

    return state