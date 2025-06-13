from typing import Dict
import re
from datetime import datetime
from backend.ai_core.models.gemini import GeminiClient
from backend.ai_core.utils.prompt_templates import get_system_prompt
from backend.ai_core.utils.logger import log_interaction
from backend.vector_db.faiss_manager import faiss_manager
import logging

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
    logger.debug(f"receive_user_input - State: {state or 'None'}")
    state = state or {}
    if "tokens_used_in_session" not in state:
        state["tokens_used_in_session"] = 0
    return state

def infer_user_role(state: Dict) -> Dict:
    logger.debug(f"infer_user_role - State before: {state or 'None'}")
    state = state or {}
    if "input" not in state:
        state["is_recruiter"] = False
        state["role_confidence"] = {"visitor": 0.5, "recruiter": 0.0}
    else:
        user_input = state["input"].lower()
        role_confidence = state.get("role_confidence", {"visitor": 0.0, "recruiter": 0.0})
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
    return state

def set_professional_context(state: Dict) -> Dict:
    logger.debug(f"set_professional_context - State before: {state or 'None'}")
    state = state or {}
    state["user_name"] = state.get("user_name", "user")
    retrieved_docs = state.get("retrieved_docs", [])
    state["system_prompt"] = get_system_prompt("recruiter", state["user_name"], retrieved_docs)
    state["minimal_prompt"] = f"Hey {state['user_name']}, I’m Dagi! Ready to dive into my technical skills and project details for your hiring needs. What specific expertise are you looking for?"
    logger.debug(f"set_professional_context - State after: {state}")
    return state

def set_visitor_context(state: Dict) -> Dict:
    logger.debug(f"set_visitor_context - State before: {state or 'None'}")
    state = state or {}
    state["user_name"] = state.get("user_name", "user")
    retrieved_docs = state.get("retrieved_docs", [])
    state["system_prompt"] = get_system_prompt("visitor", state["user_name"], retrieved_docs)
    state["minimal_prompt"] = f"Hi {state['user_name']}, I’m Dagi! Excited to share my tech journey and projects with you. What’s sparking your interest today?"
    logger.debug(f"set_visitor_context - State after: {state}")
    return state

def retrieve_rag_context(state: Dict) -> Dict:
    logger.debug(f"retrieve_rag_context - State: {state or 'None'}")
    state = state or {}
    if "input" not in state:
        state["retrieved_docs"] = []
    else:
        user_input = state["input"]
        try:
            docs = faiss_manager.search_combined(user_input, k=2) if user_input else []
            state["retrieved_docs"] = [doc.page_content for doc in docs] if docs else []
            logger.debug(f"Retrieved documents for input '{user_input}': {state['retrieved_docs']}")
        except Exception as e:
            logger.error(f"FAISS search failed: {str(e)}")
            state["retrieved_docs"] = []
    logger.debug(f"retrieve_rag_context - Retrieved docs: {state.get('retrieved_docs', [])}")
    return state

def extract_most_recent_project(docs: list[str]) -> str:
    logger.debug("Extracting most recent project")
    projects = []
    for doc in docs:
        github_pattern = r"^(.*?)\n\nREADME:(.*?)$"
        github_match = re.match(github_pattern, doc, re.DOTALL)
        if github_match:
            title = github_match.group(1).strip()
            readme = github_match.group(2).strip()
            date_pattern = r"(?:Updated|Created): (\d{4}-\d{2}-\d{2})"
            date_match = re.search(date_pattern, readme)
            update_date = datetime.strptime(date_match.group(1), "%Y-%m-%d") if date_match else datetime.now()
            projects.append((title, update_date, doc))
        static_pattern = r"(\d+)\.\s*(.*?)\s*\((\d{4})\)"
        static_matches = re.findall(static_pattern, doc)
        for match in static_matches:
            _, project_name, year = match
            update_date = datetime.strptime(year, "%Y")
            projects.append((project_name, update_date, doc))

    if projects:
        most_recent = max(projects, key=lambda x: x[1])
        project_name, _, doc = most_recent
        description_match = re.search(r"(?:Description:|\n\nREADME:)(.*?)(?:\n|$)", doc, re.DOTALL)
        description = description_match.group(1).strip() if description_match else "No description available"
        languages_match = re.search(r"Languages: (.*?)(?:\n|$)", doc)
        languages = languages_match.group(1) if languages_match else "Not specified"
        logger.debug(f"Most recent project found: {project_name}")
        return f"My most recent project is {project_name}. {description}. It uses {languages}."
    logger.debug("No recent project found")
    return "I couldn’t find details on my most recent project, but I’ve worked on the AI Portfolio Platform (2024) and Fraud Detection at Black ET (2023). Want to know more?"

def generate_response(state: Dict) -> Dict:
    logger.debug(f"generate_response - State: {state or 'None'}")
    state = state or {}
    user_input = state.get("input", "").lower()
    user_name = state.get("user_name", "user")
    retrieved_docs = state.get("retrieved_docs", [])
    is_recruiter = state.get("is_recruiter", False)

    # Ensure tokens_used_in_session is initialized
    if "tokens_used_in_session" not in state:
        state["tokens_used_in_session"] = 0
    tokens_used = state["tokens_used_in_session"]
    if tokens_used is None:
        logger.warning("tokens_used_in_session is None; setting to 0")
        tokens_used = 0
        state["tokens_used_in_session"] = 0
    token_budget = 2000

    logger.debug(f"Tokens used: {tokens_used}, Token budget: {token_budget}")
    if tokens_used >= token_budget:
        state["raw_response"] = f"Hey {user_name}, we’ve been chatting a lot! Let’s take a break. What’s your favorite topic?"
        return state

    if user_input in ["hi", "hello", "hey"]:
        state["raw_response"] = f"Hey {user_name}! I’m Dagi—excited to chat! What brought you here today?"
        return state

    if user_input == "how are you":
        state["raw_response"] = f"Hey {user_name}, I’m Dagi! I built the Fraud Detection @ Black ET with PyTorch and XGBoost, leading to a 20% reduction in false positives. Had a 3AM breakthrough with Ethiopian coffee. How about you?"
        return state

    try:
        gemini = GeminiClient(temperature=0.3)
        history = state.get("history", [])
        history_str = "\n".join([f"{user_name}: {msg['user']}\nMe: {msg['assistant']}" for msg in history]) if history else ""
        prompt = get_system_prompt("recruiter" if is_recruiter else "visitor", user_name, retrieved_docs, user_input)
        logger.debug(f"Generated Prompt: {prompt}")
        full_prompt = f"{prompt}\n\nHistory:\n{history_str}\n\nInstruction: Use the template."

        # Use a more accurate token counter if available
        prompt_tokens = len(full_prompt.split())  # Placeholder; replace with Gemini tokenizer if available
        input_tokens = len(user_input.split())
        logger.debug(f"Prompt Tokens: {prompt_tokens}, Input Tokens: {input_tokens}")
        if prompt_tokens > 4096:
            logger.warning("Prompt may be truncated due to token limit")

        messages = [{"role": "system", "content": full_prompt}, {"role": "user", "content": f"{user_name} says: {user_input}"}]
        response = gemini.generate_response(messages)
        logger.debug(f"Gemini Response: {response}")

        response_tokens = len(response.split())
        total_tokens = prompt_tokens + input_tokens + response_tokens
        logger.debug(f"Total Tokens: {total_tokens}")

        if total_tokens > token_budget:
            response = response[:token_budget - prompt_tokens - input_tokens].rsplit(" ", 1)[0] + "..."
            logger.warning("Response truncated due to token budget")

        state["raw_response"] = response
        state["tokens_used_in_session"] = total_tokens

    except Exception as e:
        logger.error(f"Exception in generate_response: {str(e)}", exc_info=True)
        if retrieved_docs:
            if "project" in user_input:
                response = f"Hey {user_name}, I’m Dagi! {extract_most_recent_project(retrieved_docs)}"
                logger.debug(f"Project response: {response}")
            elif "where did" in user_input and "intern" in user_input:
                experience_pattern = r"Experience:.*?AI Engineer intern at (.*?)(?:,|\n|$)"
                for doc in retrieved_docs:
                    match = re.search(experience_pattern, doc, re.DOTALL)
                    if match:
                        company = match.group(1)
                        response = f"Hey {user_name}, I’m Dagi! I interned at {company}. Want to know more about my experience?"
                        logger.debug(f"Internship response: {response}")
                        break
                else:
                    response = f"Hey {user_name}, I’m Dagi! I interned at Kifiya, but I couldn’t find more details. What else can I tell you?"
                    logger.debug(f"Internship fallback response: {response}")
            elif "tell me about dagi" in user_input:
                skills_pattern = r"Skills: (.*?)(?:\n|$)"
                experience_pattern = r"Experience: (.*?)(?:\n|$)"
                projects_pattern = r"Projects:\n(.*?)(?=- Experience:|\nProject:|$)"
                github_pattern = r"^(.*?)\n\nREADME:(.*?)$"
                skills = "Not specified"
                experience = "Not specified"
                projects = []
                for doc in retrieved_docs:
                    github_match = re.match(github_pattern, doc, re.DOTALL)
                    if github_match:
                        repo_title = github_match.group(1).strip()
                        projects.append(f"- {repo_title} (GitHub): {github_match.group(2)[:100]}...")
                    skills_match = re.search(skills_pattern, doc)
                    if skills_match:
                        skills = skills_match.group(1)
                    experience_match = re.search(experience_pattern, doc, re.DOTALL)
                    if experience_match:
                        experience = experience_match.group(1)
                    projects_match = re.search(projects_pattern, doc, re.DOTALL)
                    if projects_match:
                        projects.extend(projects_match.group(1).strip().split("\n"))
                projects_str = "\n".join(projects) if projects else "Not specified"
                response = f"Hey {user_name}, I’m Dagi! I’m a 4th-year CS student at Unity University with skills in {skills}. My experience includes {experience}. Some of my projects are:\n{projects_str}. What else would you like to know?"
                logger.debug(f"Tell me about Dagi response: {response}")
            else:
                response = f"Hey {user_name}, I’m Dagi! An error occurred, but here’s some info: {''.join(retrieved_docs)[:200]}... What else can I tell you?"
                logger.debug(f"Default fallback response: {response}")
        else:
            response = f"Hey {user_name}, I’m Dagi! An error occurred—I’m a 4th-year CS student at Unity University and interned at Kifiya. What’s your favorite tech topic?"
            logger.debug(f"No docs fallback response: {response}")
        state["raw_response"] = response
        state["tokens_used_in_session"] = tokens_used
    return state

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