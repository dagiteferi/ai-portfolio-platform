
from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Dict, Optional
from backend.ai_core.agent.nodes import (
    receive_user_input,
    infer_user_role,
    call_retrieve_rag_context,
    generate_response,
    update_memory,
    return_response,
)

class AgentState(TypedDict):
    input: str
    user_name: str
    history: List[Dict[str, str]]
    role_confidence: Dict[str, float]
    is_recruiter: bool
    retrieved_docs: List[str]
    response: str
    tokens_used_in_session: int
    profile: Dict[str, str]
    file_url: Optional[str]

def create_chatbot_graph():
    """
    Creates and configures the chatbot's graph.
    """
    # Define the state machine
    workflow = StateGraph(AgentState)

    # Add nodes to the graph
    workflow.add_node("receive_user_input", receive_user_input)
    workflow.add_node("infer_user_role", infer_user_role)
    workflow.add_node("retrieve_rag_context", call_retrieve_rag_context)
    workflow.add_node("generate_response", generate_response)
    workflow.add_node("update_memory", update_memory)
    workflow.add_node("return_response", return_response)

    # Define the edges to connect the nodes
    workflow.set_entry_point("receive_user_input")
    workflow.add_edge("receive_user_input", "infer_user_role")
    workflow.add_edge("infer_user_role", "retrieve_rag_context")
    workflow.add_edge("retrieve_rag_context", "generate_response")
    workflow.add_edge("generate_response", "update_memory")
    workflow.add_edge("update_memory", "return_response")
    workflow.add_edge("return_response", END)

    # Compile the graph
    return workflow.compile()
