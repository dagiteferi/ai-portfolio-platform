from langgraph.graph import StateGraph, END
from .nodes import (
      receive_user_input,
      infer_user_role,
      set_professional_context,
      set_visitor_context,
      retrieve_rag_context,
      generate_response,
      trim_format_response,
      update_memory,
      return_response,
      check_continue,
      end_session,
  )
from typing import Dict

def create_chatbot_graph():
      graph = StateGraph(dict)

      # Add nodes
      graph.add_node("receive_user_input", receive_user_input)
      graph.add_node("infer_user_role", infer_user_role)
      graph.add_node("set_professional_context", set_professional_context)
      graph.add_node("set_visitor_context", set_visitor_context)
      graph.add_node("retrieve_rag_context", retrieve_rag_context)
      graph.add_node("generate_response", generate_response)
      graph.add_node("trim_format_response", trim_format_response)
      graph.add_node("update_memory", update_memory)
      graph.add_node("return_response", return_response)
      graph.add_node("check_continue", check_continue)
      graph.add_node("end_session", end_session)

      # Define edges and conditional routing
      graph.add_edge("receive_user_input", "infer_user_role")
      graph.add_conditional_edges(
          "infer_user_role",
          lambda state: "set_professional_context" if state["is_recruiter"] else "set_visitor_context",
          {
              "set_professional_context": "set_professional_context",
              "set_visitor_context": "set_visitor_context"
          }
      )
      graph.add_edge("set_professional_context", "retrieve_rag_context")
      graph.add_edge("set_visitor_context", "retrieve_rag_context")
      graph.add_edge("retrieve_rag_context", "generate_response")
      graph.add_edge("generate_response", "trim_format_response")
      graph.add_edge("trim_format_response", "update_memory")
      graph.add_edge("update_memory", "return_response")
      graph.add_edge("return_response", "check_continue")
      graph.add_edge("check_continue", "end_session")  # Always end after one pass
      graph.add_edge("end_session", END)

      # Set entry point
      graph.set_entry_point("receive_user_input")

      return graph.compile()