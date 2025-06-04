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
          state["role_confidence"] = {"visitor": 0.5, "recruiter": 0.0}
      else:
          user_input = state["input"].lower()
          role_confidence = state.get("role_confidence", {"visitor": 0.0, "recruiter": 0.0})
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
      print(f"set_professional_context - State before: {state}")
      state["system_prompt"] = get_system_prompt("recruiter", state.get("user_name"))
      state["minimal_prompt"] = f"Respond as a professional recruiter guide for {state.get('user_name', 'user')}, be concise."
      print(f"set_professional_context - State after: {state}")
      return state

def set_visitor_context(state: Dict) -> Dict:
      print(f"set_visitor_context - State before: {state}")
      state["system_prompt"] = get_system_prompt("visitor", state.get("user_name"))
      state["minimal_prompt"] = f"Respond as a friendly visitor guide for {state.get('user_name', 'user')}, use a storytelling tone, be concise."
      print(f"set_visitor_context - State after: {state}")
      return state

def retrieve_rag_context(state: Dict) -> Dict:
      print(f"retrieve_rag_context - State: {state}")
      state["retrieved_docs"] = []
      return state

def generate_response(state: Dict) -> Dict:
      print(f"generate_response - State: {state}")
      user_input = state.get("input", "").lower()
      user_name = state.get("user_name", "user")

      tokens_used = state.get("tokens_used_in_session", 0)
      token_budget = state.get("token_budget", 500)

      if tokens_used >= token_budget:
          state["raw_response"] = f"Sorry {user_name}, I've reached my capacity for this session. Let's chat again later!"
          return state

      if user_input in ["hi", "hello", "hey"]:
          state["raw_response"] = f"Hi {user_name}! I’d love to help—can you tell me more?"
          return state

      gemini = GeminiClient()

      if not user_input:
          state["raw_response"] = f"I'm sorry {user_name}, I didn't receive a valid input to respond to."
          return state

      try:
          history = state.get("history", [])
          if len(history) > 3:
              history_summary = "User started with a greeting and asked about previous topics."
              history_str = f"Summary: {history_summary}"
          else:
              history_str = "\n".join([f"User: {msg['user']}\nAssistant: {msg['assistant']}" for msg in history])

          prompt = state["minimal_prompt"] if state.get("role_identified", False) else state["system_prompt"]
          full_prompt = f"{prompt}\n\nConversation History:\n{history_str}"

          messages = [
              {"role": "system", "content": full_prompt},
              {"role": "user", "content": user_input}
          ]

          input_tokens = len(full_prompt.split()) + len(user_input.split()) + len(history_str.split())
          state["raw_response"] = gemini.generate_response(messages)
          output_tokens = len(state["raw_response"].split())
          total_tokens = input_tokens + output_tokens
          state["tokens_used_in_session"] = tokens_used + total_tokens

          if state["tokens_used_in_session"] > token_budget * 0.8:
              state["raw_response"] += f"\nI’m running low on capacity, {user_name}, but I can still help briefly!"

      except Exception as e:
          if "429" in str(e):
              state["raw_response"] = f"Sorry {user_name}, I've hit my response limit for now. Please try again later or check https://ai.google.dev/gemini-api/docs/rate-limits for details."
          else:
              state["raw_response"] = f"Error generating response: {str(e)}"
      return state

def trim_format_response(state: Dict) -> Dict:
      print(f"trim_format_response - State: {state}")
      state["formatted_response"] = state["raw_response"].strip() if state.get("raw_response") else ""
      log_interaction(state["input"], state["formatted_response"])
      return state

def update_memory(state: Dict) -> Dict:
      print(f"update_memory - State: {state}")
      if "history" not in state:
          state["history"] = []
      state["history"].append({"user": state["input"], "assistant": state["formatted_response"]})
      return state

def return_response(state: Dict) -> Dict:
      print(f"return_response - State: {state}")
      return state

def check_continue(state: Dict) -> Dict:
      print(f"check_continue - State: {state}")
      state["continue_conversation"] = False  # End after one pass
      print(f"check_continue - continue_conversation set to: {state['continue_conversation']}")
      return state

def end_session(state: Dict) -> Dict:
      print(f"end_session - State: {state}")
      state["continue_conversation"] = False
      return state