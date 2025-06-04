from typing import Dict, List
from ..models.gemini import GeminiClient
from ..models.role_inference import infer_role
from ..utils.prompt_templates import get_system_prompt
from ..utils.logger import log_interaction

def receive_user_input(state: Dict) -> Dict:
    print(f"receive_user_input - State: {state}")
    return state

def infer_user_role(state: Dict) -> Dict:
    print(f"infer_user_role - State before: {state}")
    if "input" not in state or not state["input"]:
        state["is_recruiter"] = False
    else:
        state["is_recruiter"] = infer_role(state["input"])
    print(f"infer_user_role - State after: {state}")
    return state

def set_professional_context(state: Dict) -> Dict:
    state["system_prompt"] = get_system_prompt("recruiter", state.get("user_name"))
    return state

def set_visitor_context(state: Dict) -> Dict:
    state["system_prompt"] = get_system_prompt("visitor", state.get("user_name"))
    return state

def retrieve_rag_context(state: Dict) -> Dict:
    state["retrieved_docs"] = []
    return state

def generate_response(state: Dict) -> Dict:
    print(f"generate_response - State: {state}")
    gemini = GeminiClient()
    user_input = state.get("input", "")
    if not user_input:
        state["raw_response"] = "I'm sorry, I didn't receive a valid input to respond to."
        return state
    messages = [
        {"role": "system", "content": state["system_prompt"]},
        {"role": "user", "content": user_input}
    ]
    state["raw_response"] = gemini.generate_response(messages)
    return state

def trim_format_response(state: Dict) -> Dict:
    state["formatted_response"] = state["raw_response"].strip() if state.get("raw_response") else ""
    log_interaction(state["input"], state["formatted_response"])
    return state

def update_memory(state: Dict) -> Dict:
    if "history" not in state:
        state["history"] = []
    state["history"].append({"user": state["input"], "assistant": state["formatted_response"]})
    return state

def return_response(state: Dict) -> Dict:
    return state

def check_continue(state: Dict) -> Dict:
    print(f"check_continue - State: {state}")
    # Force end for single-turn API request
    state["continue_conversation"] = False
    return state

def end_session(state: Dict) -> Dict:
    print(f"end_session - State: {state}")
    state["continue_conversation"] = False
    return state