from typing import Dict
import re
from datetime import datetime
from backend.ai_core.models.gemini import GeminiClient
from backend.ai_core.utils.prompt_templates import get_system_prompt
from backend.ai_core.utils.logger import log_interaction
import logging

# Set up logging to ensure output is visible
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - [%(name)s] - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),  # Output to console
        logging.FileHandler('debug.log')  # Also log to a file for debugging
    ]
)
logger = logging.getLogger(__name__)

from backend.vector_db.faiss_manager import faiss_manager

def receive_user_input(state: Dict) -> Dict:
    logger.debug(f"receive_user_input - State: {state or 'None'}")
    if not state:
        state = {}
    return state

def infer_user_role(state: Dict) -> Dict:
    logger.debug(f"infer_user_role - State before: {state or 'None'}")
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

    logger.debug(f"infer_user_role - State after: {state}")
    return state

def set_professional_context(state: Dict) -> Dict:
    logger.debug(f"set_professional_context - State before: {state or 'None'}")
    if not state or "user_name" not in state:
        state = state or {}
        state["user_name"] = "user"
    retrieved_docs = state.get("retrieved_docs", [])
    state["system_prompt"] = get_system_prompt("recruiter", state.get("user_name"), retrieved_docs)
    state["minimal_prompt"] = f"Hey {state.get('user_name')}, it’s Dagi here! I’m ready to share my tech skills and projects as a recruiter guide—let’s make it awesome! What kind of talent are you looking for?"
    logger.debug(f"set_professional_context - State after: {state}")
    return state

def set_visitor_context(state: Dict) -> Dict:
    logger.debug(f"set_visitor_context - State before: {state or 'None'}")
    if not state or "user_name" not in state:
        state = state or {}
        state["user_name"] = "user"
    retrieved_docs = state.get("retrieved_docs", [])
    state["system_prompt"] = get_system_prompt("visitor", state.get("user_name"), retrieved_docs)
    state["minimal_prompt"] = f"Hi {state.get('user_name')}, I’m Dagi! I love sharing my tech adventures with a fun story—let’s dive into my world! What are you curious about today?"
    logger.debug(f"set_visitor_context - State after: {state}")
    return state

def retrieve_rag_context(state: Dict) -> Dict:
    logger.debug(f"retrieve_rag_context - State: {state or 'None'}")
    if not state or "input" not in state:
        state = state or {}
        state["retrieved_docs"] = []
    else:
        user_input = state["input"]
        try:
            docs = faiss_manager.search_combined(user_input, k=2) if user_input else []
            state["retrieved_docs"] = [doc.page_content for doc in docs] if docs else []
            logger.debug(f"Retrieved documents for input '{user_input}': {state['retrieved_docs']}")
        except Exception as e:
            logger.debug(f"DEBUG: FAISS search failed: {str(e)}")
            state["retrieved_docs"] = []
    logger.debug(f"retrieve_rag_context - Retrieved docs: {state.get('retrieved_docs', [])}")
    return state

def extract_most_recent_project(docs: list[str]) -> str:
    logger.debug("DEBUG: Extracting most recent project")
    project_pattern = r"Project: (.*?)\s*\(Updated: (.*?)\)"
    projects = []
    for doc in docs:
        matches = re.findall(project_pattern, doc)
        for match in matches:
            project_name, update_date_str = match
            try:
                update_date = datetime.strptime(update_date_str, "%Y-%m-%dT%H:%M:%SZ")
                projects.append((project_name, update_date, doc))
            except ValueError:
                continue
    
    if not projects:
        # Fallback to static projects if no dynamic projects found
        static_project_pattern = r"(\d+)\.\s*(.*?)\s*\((\d{4})\)"
        for doc in docs:
            matches = re.findall(static_project_pattern, doc)
            for match in matches:
                _, project_name, year = match
                update_date = datetime.strptime(year, "%Y")
                projects.append((project_name, update_date, doc))
    
    if projects:
        most_recent = max(projects, key=lambda x: x[1])
        project_name, _, doc = most_recent
        # Extract additional details if available
        description_match = re.search(r"Description: (.*?)(?:\n|$)", doc)
        description = description_match.group(1) if description_match else "No description available"
        languages_match = re.search(r"Languages: (.*?)(?:\n|$)", doc)
        languages = languages_match.group(1) if languages_match else "Not specified"
        logger.debug(f"DEBUG: Most recent project found: {project_name}")
        return f"My most recent project is {project_name}. {description}. It uses {languages}."
    logger.debug("DEBUG: No recent project found")
    return "I couldn’t find details on my most recent project, but I’ve worked on the AI Portfolio Platform (2024) and Fraud Detection at Black ET (2023). Want to know more?"

# ... (previous imports and functions remain the same)

def generate_response(state: Dict) -> Dict:
    logger.debug(f"generate_response - State: {state or 'None'}")
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

    # Standalone Gemini test
    logger.debug("DEBUG: Testing Gemini connection")
    try:
        test_gemini = GeminiClient(temperature=0.3)
        test_response = test_gemini.generate_response([{"role": "user", "content": "Test message"}])
        logger.debug(f"DEBUG: Test Gemini Response: {test_response}")
    except Exception as e:
        logger.debug(f"DEBUG: Test Gemini Failure: {str(e)}")

    try:
        gemini = GeminiClient(temperature=0.3)
        history = state.get("history", [])
        history_str = "\n".join([f"{user_name}: {msg['user']}\nMe: {msg['assistant']}" for msg in history]) if history else ""
        prompt = get_system_prompt("visitor" if not state.get("is_recruiter", False) else "recruiter", user_name, retrieved_docs=retrieved_docs, query=user_input)
        logger.debug(f"DEBUG: Generated Prompt: {prompt}")
        full_prompt = f"{prompt}\n\nHistory:\n{history_str}\n\nInstruction: Use the template."

        prompt_tokens = len(full_prompt.split())
        logger.debug(f"DEBUG: Prompt Token Count: {prompt_tokens}")
        if prompt_tokens > 4096:
            logger.debug("DEBUG: WARNING: Prompt may be truncated!")

        messages = [{"role": "system", "content": full_prompt}, {"role": "user", "content": f"{user_name} says: {user_input}"}]
        response = gemini.generate_response(messages)
        logger.debug(f"DEBUG: Gemini Response: {response}")

        if not response or (len(retrieved_docs) == 0 and not any(word in response.lower() for word in ["kifiya", "portfolio", "black et"])):
            raise Exception("Invalid Gemini response")

        response_tokens = len(response.split())
        total_tokens = prompt_tokens + len(user_input.split()) + response_tokens
        if total_tokens > token_budget:
            response = response[:token_budget - prompt_tokens - len(user_input.split())].rsplit(" ", 1)[0] + "..."

        state["raw_response"] = response
        state["tokens_used_in_session"] = total_tokens

    except Exception as e:
        logger.debug(f"DEBUG: Exception in generate_response: {str(e)}")
        if retrieved_docs:
            # Tailor response based on query
            logger.debug(f"DEBUG: Processing fallback for query: {user_input}")
            if "most recent project" in user_input:
                response = f"Hey {user_name}, I’m Dagi! {extract_most_recent_project(retrieved_docs)}"
                logger.debug(f"DEBUG: Most recent project response: {response}")
            elif "where did" in user_input and "intern" in user_input:
                experience_pattern = r"Experience:.*?AI Engineer intern at (.*?)(?:,|\n|$)"
                for doc in retrieved_docs:
                    match = re.search(experience_pattern, doc, re.DOTALL)
                    if match:
                        company = match.group(1)
                        response = f"Hey {user_name}, I’m Dagi! I interned at {company}. Want to know more about my experience?"
                        logger.debug(f"DEBUG: Internship response: {response}")
                        break
                else:
                    response = f"Hey {user_name}, I’m Dagi! I interned at Kifiya, but I couldn’t find more details. What else can I tell you?"
                    logger.debug(f"DEBUG: Internship fallback response: {response}")
            elif "tell me about dagi" in user_input:
                skills_pattern = r"Skills: (.*?)(?:\n|$)"
                experience_pattern = r"Experience: (.*?)(?:\n|$)"
                projects_pattern = r"Projects:\n(.*?)(?=- Experience:|\nProject:|$)"
                skills = "Not specified"
                experience = "Not specified"
                projects = "Not specified"
                for doc in retrieved_docs:
                    skills_match = re.search(skills_pattern, doc)
                    if skills_match:
                        skills = skills_match.group(1)
                    experience_match = re.search(experience_pattern, doc, re.DOTALL)
                    if experience_match:
                        experience = experience_match.group(1)
                    projects_match = re.search(projects_pattern, doc, re.DOTALL)
                    if projects_match:
                        projects = projects_match.group(1).strip()
                response = f"Hey {user_name}, I’m Dagi! I’m a 4th-year CS student at Unity University with skills in {skills}. My experience includes {experience}. Some of my projects are:\n{projects}. What else would you like to know?"
                logger.debug(f"DEBUG: Tell me about Dagi response: {response}")
            else:
                response = f"Hey {user_name}, I’m Dagi! An error occurred, but here’s some info: {''.join(retrieved_docs)}. What else can I tell you?"
                logger.debug(f"DEBUG: Default fallback response: {response}")
        else:
            response = f"Hey {user_name}, I’m Dagi! An error occurred—I’m a 4th-year CS student at Unity University and interned at Kifiya. What’s your favorite tech topic?"
            logger.debug(f"DEBUG: No docs fallback response: {response}")
        state["raw_response"] = response
        state["tokens_used_in_session"] = tokens_used
    return state

# ... (rest of the file remains the same)
def trim_format_response(state: Dict) -> Dict:
    logger.debug(f"trim_format_response - State: {state or 'None'}")
    state = state or {}
    state["formatted_response"] = state.get("raw_response", "").strip()
    log_interaction(state.get("input", "No input"), state.get("formatted_response", ""))
    return state

def update_memory(state: Dict) -> Dict:
    logger.debug(f"update_memory - State: {state or 'None'}")
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
    logger.debug(f"return_response - State: {state or 'None'}")
    return state or {}