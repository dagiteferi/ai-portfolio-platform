import time
import logging
from typing import Dict
import re
from datetime import datetime
from backend.ai_core.models.gemini import GeminiClient
from backend.ai_core.utils.prompt_templates import get_system_prompt
from backend.ai_core.utils.logger import log_interaction
from backend.vector_db.faiss_manager import faiss_manager

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('nodes.log')
    ]
)
logger = logging.getLogger(__name__)

def receive_user_input(state: Dict) -> Dict:
    import time
    start_time = time.time()
    logger.debug(f"receive_user_input - State: {state or 'None'}")
    
    state = state or {}

    # Normalize: map "message" to "input" if "input" not already present
    if "message" in state and "input" not in state:
        state["input"] = state["message"]

    # Ensure required defaults are set
    if "tokens_used_in_session" not in state:
        state["tokens_used_in_session"] = 0
    if "role_confidence" not in state:
        state["role_confidence"] = {"visitor": 0.0, "recruiter": 0.0}

    logger.debug(f"receive_user_input - Duration: {time.time() - start_time:.2f}s")
    return state



def infer_user_role(state: Dict) -> Dict:
    start_time = time.time()
    logger.debug(f"infer_user_role - State before: {state or 'None'}")
    state = state or {}
    if "role_confidence" not in state or state["role_confidence"] is None:
        logger.warning("role_confidence is None or missing; initializing")
        state["role_confidence"] = {"visitor": 0.0, "recruiter": 0.0}

    role_confidence = state["role_confidence"]
    if "input" not in state:
        state["is_recruiter"] = False
        role_confidence["visitor"] = 0.5
        role_confidence["recruiter"] = 0.0
    else:
        user_input = state["input"].lower()
        if any(word in user_input for word in ["hiring", "recruit", "job", "position"]):
            role_confidence["recruiter"] += 0.6
        elif any(word in user_input for word in ["tell me", "about", "curious", "learn"]):
            role_confidence["visitor"] += 0.5
        else:
            role_confidence["visitor"] += 0.2

        total = role_confidence["visitor"] + role_confidence["recruiter"]
        if total > 0:
            role_confidence["visitor"] /= total
            role_confidence["recruiter"] /= total

    state["role_confidence"] = role_confidence
    state["is_recruiter"] = role_confidence["recruiter"] > role_confidence["visitor"]
    state["role_identified"] = role_confidence["recruiter"] >= 0.9 or role_confidence["visitor"] >= 0.9
    logger.debug(f"infer_user_role - State after: {state}")
    logger.debug(f"infer_user_role - Duration: {time.time() - start_time:.2f}s")
    return state

# def retrieve_rag_context(state: Dict) -> Dict:
#     start_time = time.time()
#     logger.debug(f"retrieve_rag_context - State: {state or 'None'}")
#     state = state or {}
#     if "input" not in state:
#         state["retrieved_docs"] = []
#     else:
#         user_input = state["input"]
#         try:
#             docs = faiss_manager.search_combined(user_input, k=2) if user_input else []
#             state["retrieved_docs"] = [doc.page_content for doc in docs] if docs else []
#             logger.debug(f"Retrieved documents for input '{user_input}': {state['retrieved_docs']}")
#         except Exception as e:
#             logger.error(f"FAISS search failed: {str(e)}")
#             state["retrieved_docs"] = []
#     logger.debug(f"retrieve_rag_context - Duration: {time.time() - start_time:.2f}s")
#     return state


def retrieve_rag_context(state: Dict) -> Dict:
    import time
    start_time = time.time()
    logger.debug(f"retrieve_rag_context - State: {state or 'None'}")
    state = state or {}
    user_input = state.get("input", "")

    # Keywords that require knowledge base search
    search_keywords = [
        "project", "repo", "repository", "experience", "education", "contact", "email", "about", "skill", "intern", "work", "background"
    ]
    greetings = ["hi", "hello", "hey", "how are you", "good morning", "good afternoon", "good evening"]

    if any(greet in user_input.lower() for greet in greetings):
        state["retrieved_docs"] = []
        logger.debug("Skipped knowledge base search for greeting/small talk input.")
    elif any(keyword in user_input.lower() for keyword in search_keywords):
        try:
            docs = faiss_manager.search_combined(user_input, k=2) if user_input else []
            state["retrieved_docs"] = [doc.page_content for doc in docs] if docs else []
            logger.debug(f"Retrieved documents for input '{user_input}': {state['retrieved_docs']}")
        except Exception as e:
            logger.error(f"FAISS search failed: {str(e)}")
            state["retrieved_docs"] = []
    else:
        state["retrieved_docs"] = []
        logger.debug("Skipped knowledge base search for non-factual input.")

    logger.debug(f"retrieve_rag_context - Duration: {time.time() - start_time:.2f}s")
    return state

def generate_response(state: Dict) -> Dict:
    import time
    start_time = time.time()
    state = state or {}

    user_input = (state.get("input") or state.get("message") or "").strip()
    user_input_lower = user_input.lower()
    profile = state.get("profile", {})
    user_name = state.get("user_name", "user")
    retrieved_docs = state.get("retrieved_docs", [])
    is_recruiter = state.get("is_recruiter", False)
    tokens_used = state.get("tokens_used_in_session", 0)
    token_budget = 2000

    # Direct fallback for contact info (always from knowledge base)
    if any(word in user_input_lower for word in ["contact", "email", "phone", "linkedin"]):
        email = profile.get("email")
        phone = profile.get("phone")
        linkedin = profile.get("linkedin")
        if linkedin and not linkedin.startswith("http"):
            linkedin = "https://" + linkedin.lstrip("/")
        parts = []
        if "email" in user_input_lower and email:
            parts.append(f"My email is {email}.")
        if "phone" in user_input_lower and phone:
            parts.append(f"My phone number is {phone}.")
        if "linkedin" in user_input_lower and linkedin:
            parts.append(f"My LinkedIn: {linkedin}")
        if "contact" in user_input_lower or not parts:
            if email:
                parts.append(f"Email: {email}")
            if phone:
                parts.append(f"Phone: {phone}")
            if linkedin:
                parts.append(f"LinkedIn: {linkedin}")
        if not parts:
            state["raw_response"] = "Sorry, I don't have that information in my knowledge base."
        else:
            state["raw_response"] = " ".join(parts)
        state["tokens_used_in_session"] = tokens_used + len(user_input.split())
        return state

    # Use LLM with retrieved context
    try:
        prompt = get_system_prompt(
            "recruiter" if is_recruiter else "visitor",
            user_name,
            retrieved_docs,
            user_input
        )
        gemini = GeminiClient(temperature=0.3)
        history = state.get("history", [])
        history_str = "\n".join([
            f"{getattr(msg, 'user_name', user_name)}: {getattr(msg, 'user', '')}\nMe: {getattr(msg, 'assistant', '')}"
            for msg in history
        ]) if history else ""
        full_prompt = f"{prompt}\n\nHistory:\n{history_str}\n\nInstruction: Use the template."
        prompt_tokens = len(full_prompt.split())
        input_tokens = len(user_input.split())
        messages = [
            {"role": "system", "content": full_prompt},
            {"role": "user", "content": f"{user_name} says: {user_input}"}
        ]
        response = gemini.generate_response(messages)
        response_tokens = len(response.split())
        total_tokens = prompt_tokens + input_tokens + response_tokens
        state["raw_response"] = response
        state["tokens_used_in_session"] = tokens_used + total_tokens
    except Exception as e:
        summary = (
            f"I'm Dagmawi Teferi, a Data Scientist & AI/ML Engineer with experience in "
            f"{profile.get('skills', '')}. My background includes {profile.get('experience', '')}."
        )
        state["raw_response"] = summary

    return state


def set_professional_context(state: Dict) -> Dict:
    start_time = time.time()
    logger.debug(f"set_professional_context - State before: {state or 'None'}")
    state = state or {}
    user_name = state.get("user_name", "user")
    state["response_context"] = (
        f" {user_name}, , a 4th-year CS student at Unity University with a passion for AI and full-stack development. "
        "I’ve interned at Kifiya, built a credit scoring model with 0.9998 ROC-AUC, and worked on fraud detection at Black ET, reducing false positives by 20%. "
        "I specialize in Python, React, FastAPI, and machine learning. Let’s dive into how I can contribute to your team!"
    )
    logger.debug(f"set_professional_context - State after: {state}")
    logger.debug(f"set_professional_context - Duration: {time.time() - start_time:.2f}s")
    return state

def set_visitor_context(state: Dict) -> Dict:
    start_time = time.time()
    logger.debug(f"set_visitor_context - State before: {state or 'None'}")
    state = state or {}
    user_name = state.get("user_name", "user")
    state["response_context"] = (
        f" {user_name},  Welcome to my world of tech. I’m a 4th-year CS student at Unity University, "
        "obsessed with building cool stuff like AI chatbots and credit scoring models. I’ve interned at Kifiya and tackled fraud detection with PyTorch. "
        "Fun fact: I once debugged code at 3AM with Ethiopian coffee! What tech topic are you curious about?"
    )
    logger.debug(f"set_visitor_context - State after: {state}")
    logger.debug(f"set_visitor_context - Duration: {time.time() - start_time:.2f}s")
    return state

def trim_format_response(state: Dict) -> Dict:
    start_time = time.time()
    logger.debug(f"trim_format_response - State before: {state or 'None'}")
    state = state or {}
    user_name = state.get("user_name", "user")
    raw_response = state.get("raw_response", "")
    context = state.get("response_context", "")
    is_recruiter = state.get("is_recruiter", False)

    # Only use greeting if the raw_response is a greeting
    if raw_response.lower().startswith("hey") and ("excited to chat" in raw_response or "what brought you here" in raw_response):
        final_response = raw_response
    else:
        # For all other answers, just use the LLM response and context (if needed)
        final_response = f"{context}\n\n{raw_response}" if context else raw_response
        if is_recruiter:
            final_response += "\n\nInterested in my skills? Let’s connect at dagiteferi2011@gmail.com!"

    state["response"] = final_response.strip()
    log_interaction(state.get("input", ""), final_response)
    logger.debug(f"trim_format_response - Final response: {final_response}")
    logger.debug(f"trim_format_response - Duration: {time.time() - start_time:.2f}s")
    return state

def update_memory(state: Dict) -> Dict:
    start_time = time.time()
    logger.debug(f"update_memory - State before: {state or 'None'}")
    state = state or {}
    user_input = state.get("input", "")
    raw_response = state.get("raw_response", "")
    user_name = state.get("user_name", "user")

    if "history" not in state:
        state["history"] = []

    if user_input and raw_response:
        state["history"].append({
            "user": user_input,
            "assistant": raw_response,
            "timestamp": datetime.now().isoformat(),
            "user_name": user_name
        })
        # Limit history to last 10 interactions to manage memory
        state["history"] = state["history"][-10:]

    logger.debug(f"update_memory - State after: {state}")
    logger.debug(f"update_memory - Duration: {time.time() - start_time:.2f}s")
    return state
def extract_most_recent_project(retrieved_docs):
    # Simple logic: return the first project-related doc snippet
    for doc in retrieved_docs:
        if "project" in doc.lower() or "model" in doc.lower():
            return doc[:200]  # Return a short snippet
    return retrieved_docs[0][:200] if retrieved_docs else "No project info found."

def return_response(state: Dict) -> Dict:
    # Always return at least one required field
    return {
        "raw_response": state.get("raw_response", "No response generated."),
        "response": state.get("response", "No response generated.")
    }
