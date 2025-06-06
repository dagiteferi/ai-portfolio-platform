from typing import Dict, List
from backend.ai_core.models.gemini import GeminiClient
from backend.ai_core.models.role_inference import infer_role
from backend.ai_core.utils.prompt_templates import get_system_prompt
from backend.ai_core.utils.logger import log_interaction
from backend.vector_db.faiss_manager import faiss_manager
import random

from typing import Dict, List
from backend.ai_core.models.gemini import GeminiClient
from backend.ai_core.utils.prompt_templates import get_system_prompt
from backend.vector_db.faiss_manager import faiss_manager

def receive_user_input(state: Dict) -> Dict:
    print(f"receive_user_input - State: {state or 'None'}")
    if not state:
        state = {}
    return state

def infer_user_role(state: Dict) -> Dict:
    print(f"infer_user_role - State before: {state or 'None'}")
    if not state or "input" not in state:
        state = state or {}
        state["is_recruiter"] = False
        state["role_confidence"] = {"visitor": 0.5, "recruiter": 0.0}
    else:
        user_input = state["input"].lower()
        role_confidence = state.get("role_confidence") or {"visitor": 0.0, "recruiter": 0.0}
        if "hiring" in user_input or "recruit" in user_input:
            role_confidence["recruiter"] += 0.6
        elif "tell me" in user_input or "about" in user_input:
            role_confidence["visitor"] += 0.5
        else:
            role_confidence["visitor"] += 0.2

        total = role_confidence["visitor"] + role_confidence["recruiter"]
        if total > 0:
            role_confidence["visitor"] /= total
            role_confidence["recruiter"] /= total

        state["role_confidence"] = role_confidence

        if role_confidence["recruiter"] >= 0.9:
            state["is_recruiter"] = True
            state["role_identified"] = True
        elif role_confidence["visitor"] >= 0.9:
            state["is_recruiter"] = False
            state["role_identified"] = True
        else:
            state["is_recruiter"] = role_confidence["recruiter"] > role_confidence["visitor"]

    print(f"infer_user_role - State after: {state}")
    return state

def set_professional_context(state: Dict) -> Dict:
    print(f"set_professional_context - State before: {state or 'None'}")
    if not state or "user_name" not in state:
        state = state or {}
        state["user_name"] = "user"
    retrieved_docs = state.get("retrieved_docs", [])
    state["system_prompt"] = get_system_prompt("recruiter", state.get("user_name"), retrieved_docs)
    state["minimal_prompt"] = f"Hey, it’s Dagi here! I’m ready to share my tech skills and projects as a recruiter guide—let’s make it awesome! What kind of talent are you looking for?"
    print(f"set_professional_context - State after: {state}")
    return state

def set_visitor_context(state: Dict) -> Dict:
    print(f"set_visitor_context - State before: {state or 'None'}")
    if not state or "user_name" not in state:
        state = state or {}
        state["user_name"] = "user"
    retrieved_docs = state.get("retrieved_docs", [])
    state["system_prompt"] = get_system_prompt("visitor", state.get("user_name"), retrieved_docs)
    state["minimal_prompt"] = f"Hi there, I’m Dagi! I love sharing my tech adventures with a fun story—let’s dive into my world! What are you curious about today?"
    print(f"set_visitor_context - State after: {state}")
    return state

def retrieve_rag_context(state: Dict) -> Dict:
    print(f"retrieve_rag_context - State: {state or 'None'}")
    if not state or "input" not in state:
        state = state or {}
        state["retrieved_docs"] = []
    else:
        user_input = state["input"]
        docs = faiss_manager.search_combined(user_input, k=2) if user_input else []
        state["retrieved_docs"] = [doc.page_content for doc in docs] if docs else []
        print(f"Retrieved documents for input '{user_input}': {state['retrieved_docs']}")
    print(f"retrieve_rag_context - Retrieved docs: {state.get('retrieved_docs', [])}")
    return state

def generate_response(state: Dict) -> Dict:
    print(f"generate_response - State: {state or 'None'}")
    if not state:
        state = {}
    user_input = state.get("input", "").lower()
    user_name = state.get("user_name", "user")
    retrieved_docs = state.get("retrieved_docs", [])

    if "tokens_used_in_session" not in state:
        state["tokens_used_in_session"] = 0
    tokens_used = state["tokens_used_in_session"]
    token_budget = 2000

    if tokens_used is not None and tokens_used >= token_budget:
        state["raw_response"] = f"Hey {user_name}, we’ve been chatting a lot! Let’s take a break. What’s your favorite topic?"
        state["tokens_used_in_session"] = tokens_used
        return state

    if user_input in ["hi", "hello", "hey"]:
        state["raw_response"] = f"Hey {user_name}! It’s Dagi here—excited to chat! What brought you here today?"
        state["tokens_used_in_session"] = tokens_used
        return state

    if user_input == "how are you":
        state["raw_response"] = f"Hey {user_name}, I’m Dagi! I built the Fraud Detection @ Black ET with PyTorch and XGBoost, leading to 20% reduction in false positives. 3AM breakthrough with Ethiopian coffee. How about you?"
        state["tokens_used_in_session"] = tokens_used
        return state

    try:
        gemini = GeminiClient(temperature=0.3)
        history = state.get("history", [])
        history_str = "\n".join([f"{user_name}: {msg['user']}\nMe: {msg['assistant']}" for msg in history]) if history else ""
        prompt = get_system_prompt("visitor" if not state.get("is_recruiter", False) else "recruiter", user_name, retrieved_docs=retrieved_docs, query=user_input)
        print(f"Generated Prompt: {prompt}")
        full_prompt = f"{prompt}\n\nHistory:\n{history_str}\n\nInstruction: Use the template."

        prompt_tokens = len(full_prompt.split())
        print(f"Prompt Token Count: {prompt_tokens}")
        if prompt_tokens > 4096:
            print("WARNING: Prompt may be truncated!")

        messages = [{"role": "system", "content": full_prompt}, {"role": "user", "content": f"{user_name} says: {user_input}"}]
        response = gemini.generate_response(messages)
        print(f"Gemini Response: {response}")

        # Relaxed validation with fallback responses
        allowed_projects = ["AI Portfolio Platform", "Fraud Detection @ Black ET"]
        allowed_techs = ["Gemini", "LangGraph", "React", "PyTorch", "XGBoost"]
        allowed_metrics = ["30% faster deployment", "20% reduction in false positives"]
        allowed_experiences = ["AI/ML Engineer at Black ET", "AI Engineer intern at Kifiya", "4th-year CS student at Unity University"]
        if "intern" in user_input or "experience" in user_input:
            if not any(exp in response.lower() for exp in [exp.lower() for exp in allowed_experiences]):
                response = f"Hey {user_name}, I’m Dagi! I interned as an AI Engineer at Kifiya and worked as an AI/ML Engineer at Black ET. What kind of experience are you looking for, {user_name}?"
        elif not response or (not any(proj.lower() in response.lower() for proj in allowed_projects) and not any(tech.lower() in response.lower() for tech in allowed_techs) and not any(metric.lower() in response.lower() for metric in allowed_metrics)):
            # Fallback using retrieved docs if available, otherwise default
            if retrieved_docs:
                response = f"Hey {user_name}, I’m Dagi! Here’s a bit about me: {retrieved_docs[0]}. What would you like to explore next?"
            else:
                response = f"Hey {user_name}, I’m Dagi! I’m working on the AI Portfolio Platform with React and Gemini to showcase my AI projects. What would you like to know more about, {user_name}?"

        response_tokens = len(response.split())
        total_tokens = prompt_tokens + len(user_input.split()) + response_tokens
        if total_tokens > token_budget:
            response = response[:token_budget - prompt_tokens - len(user_input.split())].rsplit(" ", 1)[0] + "..."

        state["raw_response"] = response
        state["tokens_used_in_session"] = total_tokens

    except Exception as e:
        print(f"Exception in generate_response: {str(e)}")
        # Fallback with knowledge base content
        if retrieved_docs:
            state["raw_response"] = f"Hey {user_name}, I’m Dagi! Something went wrong, but here’s something about me: {retrieved_docs[0]}. What else can I share with you?"
        else:
            state["raw_response"] = f"Hey {user_name}, I’m Dagi! Something went wrong—I’m a 4th-year CS student at Unity University and interned at Kifiya. What’s your favorite tech topic?"
        state["tokens_used_in_session"] = tokens_used
    return state

def trim_format_response(state: Dict) -> Dict:
    print(f"trim_format_response - State: {state or 'None'}")
    state = state or {}
    state["formatted_response"] = state.get("raw_response", "").strip()
    log_interaction(state.get("input", "No input"), state.get("formatted_response", ""))
    return state

def update_memory(state: Dict) -> Dict:
    print(f"update_memory - State: {state or 'None'}")
    state = state or {}
    if "history" not in state:
        state["history"] = []
    input_val = state.get("input", "")
    formatted_response = state.get("formatted_response", "")
    if input_val and formatted_response:
        state["history"].append({"user": input_val, "assistant": formatted_response})
    if "tokens_used_in_session" not in state:
        state["tokens_used_in_session"] = 0
    return state

def return_response(state: Dict) -> Dict:
    print(f"return_response - State: {state or 'None'}")
    return state or {}