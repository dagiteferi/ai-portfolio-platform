import time
import logging
from typing import Dict
from backend.ai_core.models.gemini import GeminiClient
from backend.ai_core.utils.prompt_templates import get_system_prompt
from backend.ai_core.utils.logger import log_interaction
from backend.vector_db.faiss_manager import faiss_manager

# Configure structured logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def receive_user_input(state: Dict) -> Dict:
    """
    Initializes or normalizes the state at the beginning of a turn.
    This node is critical for ensuring the state is always in a valid format.
    """
    start_time = time.time()
    
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
    logger.debug(f"receive_user_input - Duration: {time.time() - start_time:.2f}s")
    return state

def infer_user_role(state: Dict) -> Dict:
    """
    Infers the user's role (recruiter or visitor) based on keywords in their input.
    """
    start_time = time.time()
    user_input = state.get("input", "").lower()
    # Safely get role_confidence, providing a default dict to prevent errors.
    role_confidence = state.get("role_confidence") or {"visitor": 0.5, "recruiter": 0.5}

    # Define keywords for role inference
    recruiter_keywords = ["hiring", "recruit", "job", "position", "candidate", "resume", "cv", "opportunity"]
    
    # Update confidence based on keywords
    if any(word in user_input for word in recruiter_keywords):
        role_confidence["recruiter"] += 0.25
    else:
        role_confidence["visitor"] += 0.1

    # Normalize confidence scores to sum to 1.0
    total = role_confidence["visitor"] + role_confidence["recruiter"]
    if total > 0:
        role_confidence["visitor"] /= total
        role_confidence["recruiter"] /= total

    state["role_confidence"] = role_confidence
    state["is_recruiter"] = role_confidence["recruiter"] > 0.65  # Higher threshold for more certainty
    
    logger.info(f"Inferred role: {'Recruiter' if state['is_recruiter'] else 'Visitor'} with confidence: {role_confidence}")
    logger.debug(f"infer_user_role - Duration: {time.time() - start_time:.2f}s")
    return state

def retrieve_rag_context(state: Dict) -> Dict:
    """
    Retrieves relevant documents from the knowledge base based on the user's input.
    Skips retrieval for simple greetings or small talk.
    """
    start_time = time.time()
    user_input = state.get("input", "").lower()

    # Keywords that trigger a knowledge base search
    search_keywords = [
        "project", "experience", "education", "skill", "internship", "contact", "email", 
        "background", "kifiya", "unity university", "credit scoring", "fraud detection", "about you", "dagi"
    ]
    
    # Greetings that should not trigger a search
    greetings = ["hi", "hello", "hey", "how are you", "good morning", "good afternoon", "what's up"]

    # Check if the input is a simple greeting without any search keywords
    if any(greet in user_input for greet in greetings) and not any(kw in user_input for kw in search_keywords):
        state["retrieved_docs"] = []
        logger.info("Skipping knowledge base search for simple greeting.")
    else: # In all other cases, attempt a knowledge base search
        try:
            logger.info(f"Searching knowledge base for query: {user_input}")
            docs = faiss_manager.search_combined(user_input, k=4)  # Increased k for more context
            state["retrieved_docs"] = [doc.page_content for doc in docs] if docs else []
            logger.info(f"Retrieved {len(state['retrieved_docs'])} documents.")
        except Exception as e:
            logger.error(f"FAISS search failed: {e}", exc_info=True)
            state["retrieved_docs"] = []

    logger.debug(f"retrieve_rag_context - Duration: {time.time() - start_time:.2f}s")
    return state

def generate_response(state: Dict) -> Dict:
    """
    Generates a response using the Gemini model based on the user's input, role, and retrieved context.
    """
    start_time = time.time()
    user_input = state.get("input", "")
    user_name = state.get("user_name", "there")
    retrieved_docs = state.get("retrieved_docs", [])
    is_recruiter = state.get("is_recruiter", False)
    history = state.get("history", [])

    try:
        # Determine role for prompt generation
        role = "recruiter" if is_recruiter else "visitor"
        
        # Construct the system prompt
        system_prompt = get_system_prompt(role, user_name, retrieved_docs)
        
        # Initialize the Gemini client
        gemini = GeminiClient(temperature=0.6)

        # Generate the response
        response_text = gemini.generate_response(system_prompt, history, user_input)
        state["response"] = response_text
        
        logger.info(f"Generated response for {user_name}: {response_text[:100]}...")

    except Exception as e:
        logger.error(f"Error during response generation: {e}", exc_info=True)
        state["response"] = "I'm sorry, but I encountered an error while trying to generate a response. Could you please try asking again?"

    logger.debug(f"generate_response - Duration: {time.time() - start_time:.2f}s")
    return state

def update_memory(state: Dict) -> Dict:
    """
    Updates the conversation history with the latest turn.
    """
    start_time = time.time()
    user_input = state.get("input", "")
    response = state.get("response", "")

    if user_input and response:
        # Ensure history is a list before appending
        if not isinstance(state.get("history"), list):
            state["history"] = []
        state["history"].append({"user": user_input, "assistant": response})
        # Keep the history concise to manage token limits
        state["history"] = state["history"][-5:]
        logger.info("Conversation history updated.")

    logger.debug(f"update_memory - Duration: {time.time() - start_time:.2f}s")
    return state

def return_response(state: Dict) -> Dict:
    """
    Prepares the final response to be sent back to the user.
    """
    final_response = state.get("response", "No response generated.")
    log_interaction(state.get("input", ""), final_response)
    return {"response": final_response}
