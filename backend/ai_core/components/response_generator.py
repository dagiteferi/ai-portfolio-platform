import re
import logging
from typing import Dict
from backend.ai_core.models.gemini import GeminiClient
from backend.ai_core.utils.prompt_templates import get_system_prompt
from backend.config import LLM_TEMPERATURE

logger = logging.getLogger(__name__)

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
        
        # Check if the user is asking about top chats and senders
        if "top chats and senders" in user_input.lower() or "chat data" in user_input.lower():
            chat_data_responses = []
            for doc in retrieved_docs:
                if "top_10_chats_and_senders.csv" in doc.metadata.get("source", ""):
                    # Extract information from the structured page_content using regex
                    chat_id_match = re.search(r"Chat ID: (.*?)\n", doc.page_content)
                    sender_match = re.search(r"Sender: (.*?)\n", doc.page_content)
                    message_count_match = re.search(r"Message Count: (.*)", doc.page_content)

                    chat_id = chat_id_match.group(1).strip() if chat_id_match else "N/A"
                    sender = sender_match.group(1).strip() if sender_match else "N/A"
                    message_count = message_count_match.group(1).strip() if message_count_match else "N/A"
                    
                    chat_data_responses.append(f"Chat ID: {chat_id}, Sender: {sender}, Message Count: {message_count}")
            
            if chat_data_responses:
                response_text = "Here are the top chats and senders from my knowledge base:\n" + "\n".join(chat_data_responses)
                state["response"] = response_text
                logger.info(f"Generated direct response for {user_name}: {response_text[:100]}...")
                return state
            else:
                # If no chat data found for the query, proceed with LLM generation
                system_prompt = get_system_prompt(role, user_name, retrieved_docs)
                gemini = GeminiClient(temperature=LLM_TEMPERATURE)
                response_text = gemini.generate_response(system_prompt, history, user_input)
                state["response"] = response_text
                logger.info(f"Generated response for {user_name}: {response_text[:100]}...")
                return state

        system_prompt = get_system_prompt(role, user_name, retrieved_docs)
        
        gemini = GeminiClient(temperature=LLM_TEMPERATURE)

        response_text = gemini.generate_response(system_prompt, history, user_input)
        state["response"] = response_text
        
        logger.info(f"Generated response for {user_name}: {response_text[:100]}...")

    except Exception as e:
        logger.error(f"Error during response generation: {e}", exc_info=True)
        state["response"] = "I'm sorry, but I encountered an error while trying to generate a response. Could you please try asking again?"

    return state
