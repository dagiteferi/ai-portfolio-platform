from langchain_core.messages import SystemMessage, HumanMessage
from typing import Dict
from .state import ChatState
from ..models.gemini import GeminiClient
from ..models.role_inference import infer_role
from ..utils.prompt_templates import get_system_prompt
from ..utils.logger import log_interaction

def receive_user_input(state: ChatState, input: Dict[str, str]) -> ChatState:
    """
    Node 1: Captures the user's message and updates the state.
    
    Args:
        state (ChatState): Current state of the conversation.
        input (dict): Input containing the user's query.
    
    Returns:
        ChatState: Updated state with the user's message.
    """
    state.input = input["query"]
    state.user_name = input.get("user_name")
    return state

def infer_user_role(state: ChatState) -> ChatState:
    """
    Node 2: Infers whether the user is a recruiter or visitor.
    
    Args:
        state (ChatState): Current state of the conversation.
    
    Returns:
        ChatState: Updated state with inferred role.
    """
    state.is_recruiter = infer_role(state.input)
    return state

def set_professional_context(state: ChatState) -> ChatState:
    """
    Node 4: Sets system prompt for recruiters.
    
    Args:
        state (ChatState): Current state of the conversation.
    
    Returns:
        ChatState: Updated state with professional prompt.
    """
    state.system_prompt = get_system_prompt("recruiter", state.user_name)
    return state

def set_visitor_context(state: ChatState) -> ChatState:
    """
    Node 5: Sets system prompt for visitors.
    
    Args:
        state (ChatState): Current state of the conversation.
    
    Returns:
        ChatState: Updated state with visitor prompt.
    """
    state.system_prompt = get_system_prompt("visitor", state.user_name)
    return state

def retrieve_rag_context(state: ChatState) -> ChatState:
    """
    Node 6: Placeholder for RAG retrieval (implemented in Phase 2).
    
    Args:
        state (ChatState): Current state of the conversation.
    
    Returns:
        ChatState: Updated state with empty retrieved docs for now.
    """
    state.retrieved_docs = []
    return state

def generate_response(state: ChatState) -> ChatState:
    """
    Node 7: Generates a response using Gemini API.
    
    Args:
        state (ChatState): Current state of the conversation.
    
    Returns:
        ChatState: Updated state with Gemini's response.
    """
    gemini = GeminiClient()
    messages = [
        {"role": "system", "content": state.system_prompt},
        {"role": "user", "content": state.input}
    ]
    state.raw_response = gemini.generate_response(messages)
    return state

def trim_format_response(state: ChatState) -> ChatState:
    """
    Node 8: Cleans and formats the raw response.
    
    Args:
        state (ChatState): Current state of the conversation.
    
    Returns:
        ChatState: Updated state with formatted response.
    """
    state.formatted_response = state.raw_response.strip()
    log_interaction(state.input, state.formatted_response)
    return state

def update_memory(state: ChatState) -> ChatState:
    """
    Node 9: Updates conversation memory with the latest interaction.
    
    Args:
        state (ChatState): Current state of the conversation.
    
    Returns:
        ChatState: Updated state with new history entry.
    """
    state.history.append({"user": state.input, "assistant": state.formatted_response})
    return state

def return_response(state: ChatState) -> ChatState:
    """
    Node 10: Prepares the response to be returned to the user.
    
    Args:
        state (ChatState): Current state of the conversation.
    
    Returns:
        ChatState: State ready for response output.
    """
    return state

def check_continue(state: ChatState) -> ChatState:
    """
    Node 11: Checks if the conversation should continue.
    
    Args:
        state (ChatState): Current state of the conversation.
    
    Returns:
        ChatState: Updated state with continuation flag.
    """
    exit_keywords = ["exit", "quit", "bye"]
    state.continue_conversation = not any(keyword in state.input.lower() for keyword in exit_keywords)
    return state

def end_session(state: ChatState) -> ChatState:
    """
    Node 12: Terminates the session.
    
    Args:
        state (ChatState): Current state of the conversation.
    
    Returns:
        ChatState: Final state with session ended.
    """
    state.continue_conversation = False
    return state