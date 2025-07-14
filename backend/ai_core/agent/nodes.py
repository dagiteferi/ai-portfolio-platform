import logging
from typing import Dict
from backend.ai_core.components.input_processor import process_user_input
from backend.ai_core.components.role_analyzer import analyze_user_role
from backend.ai_core.components.rag_retriever import retrieve_rag_context
from backend.ai_core.components.response_generator import generate_ai_response
from backend.ai_core.components.memory_updater import update_conversation_memory
from backend.ai_core.utils.logger import log_interaction

logger = logging.getLogger(__name__)

def receive_user_input(state: Dict) -> Dict:
    return process_user_input(state)

def infer_user_role(state: Dict) -> Dict:
    return analyze_user_role(state)

async def call_retrieve_rag_context(state: Dict) -> Dict:
    return await retrieve_rag_context(state)

def generate_response(state: Dict) -> Dict:
    return generate_ai_response(state)

def update_memory(state: Dict) -> Dict:
    return update_conversation_memory(state)

def return_response(state: Dict) -> Dict:
    final_response = state.get("response", "No response generated.")
    log_interaction(state.get("input", ""), final_response)
    return {"response": final_response}