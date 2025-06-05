from typing import Dict, List
from backend.ai_core.models.gemini import GeminiClient
from backend.ai_core.models.role_inference import infer_role
from backend.ai_core.utils.prompt_templates import get_system_prompt
from backend.ai_core.utils.logger import log_interaction
from backend.vector_db.faiss_manager import faiss_manager

def receive_user_input(state: Dict) -> Dict:
      print(f"receive_user_input - State: {state or 'None'}")
      if not state:
          state = {}
      return state

def infer_user_role(state: Dict) -> Dict:
      print(f"infer_user_role - State before: {state or 'None'}")
      if not state or "input" not in state:
          state = state or {}
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
      print(f"set_professional_context - State before: {state or 'None'}")
      if not state or "user_name" not in state:
          state = state or {}
          state["user_name"] = "user"
      state["system_prompt"] = get_system_prompt("recruiter", state.get("user_name"))
      state["minimal_prompt"] = f"Respond as a professional recruiter guide for {state.get('user_name', 'user')}, be concise."
      print(f"set_professional_context - State after: {state}")
      return state

def set_visitor_context(state: Dict) -> Dict:
      print(f"set_visitor_context - State before: {state or 'None'}")
      if not state or "user_name" not in state:
          state = state or {}
          state["user_name"] = "user"
      state["system_prompt"] = get_system_prompt("visitor", state.get("user_name"))
      state["minimal_prompt"] = f"Respond as a friendly visitor guide for {state.get('user_name', 'user')}, use a storytelling tone, be concise."
      print(f"set_visitor_context - State after: {state}")
      return state

def retrieve_rag_context(state: Dict) -> Dict:
      print(f"retrieve_rag_context - State: {state or 'None'}")
      if not state or "input" not in state:
          state = state or {}
          state["retrieved_docs"] = []
      else:
          user_input = state["input"]
          docs = faiss_manager.search(user_input, k=2) if user_input else []
          state["retrieved_docs"] = [doc.page_content for doc in docs] if docs else []
      print(f"retrieve_rag_context - Retrieved docs: {state.get('retrieved_docs', [])}")
      return state

def generate_response(state: Dict) -> Dict:
      print(f"generate_response - State: {state or 'None'}")
      if not state:
          state = {}
      user_input = state.get("input", "").lower()
      user_name = state.get("user_name", "user")

      if "tokens_used_in_session" not in state:
          state["tokens_used_in_session"] = 0
      tokens_used = state["tokens_used_in_session"]
      token_budget = 2000

      if tokens_used >= token_budget:
          state["raw_response"] = f"Hi {user_name}! It seems I've handled a lot today. Let’s take a break and chat again soon!"
          return state

      if user_input in ["hi", "hello", "hey"]:
          state["raw_response"] = f"Hi {user_name}! I’d love to help—can you tell me more?"
          return state

      if not user_input:
          state["raw_response"] = f"I'm sorry {user_name}, I didn't receive a valid input to respond to."
          return state

      try:
          gemini = GeminiClient()
          history = state.get("history", [])
          if len(history) > 3:
              history_summary = "User started with a greeting and asked about previous topics."
              history_str = f"Summary: {history_summary}"
          else:
              history_str = "\n".join([f"User: {msg['user']}\nAssistant: {msg['assistant']}" for msg in history]) if history else ""

          retrieved_docs = state.get("retrieved_docs", [])
          docs_str = "\n".join(retrieved_docs) if retrieved_docs else "No relevant documents found."

          prompt = state.get("minimal_prompt", "") if state.get("role_identified", False) else state.get("system_prompt", "")
          full_prompt = f"{prompt}\n\nRelevant Information:\n{docs_str}\n\nConversation History:\n{history_str}"

          messages = [
              {"role": "system", "content": full_prompt},
              {"role": "user", "content": user_input}
          ]

          response = gemini.generate_response(messages)
          state["raw_response"] = response if response else f"Oops, {user_name}, no response from the model."
          output_tokens = len(state["raw_response"].split())
          total_tokens = len(full_prompt.split()) + len(user_input.split()) + len(history_str.split()) + output_tokens
          state["tokens_used_in_session"] = tokens_used + total_tokens

          if state["tokens_used_in_session"] > token_budget * 0.8:
              state["raw_response"] += f"\nHi {user_name}, I’m nearing my limit today—let’s wrap up soon!"

      except Exception as e:
          state["raw_response"] = f"Oops, {user_name}, something went wrong. Let’s try that again later! (Error: {str(e)})"
      return state

def trim_format_response(state: Dict) -> Dict:
      print(f"trim_format_response - State: {state or 'None'}")
      state = state or {}
      state["formatted_response"] = state.get("raw_response", "").strip()
      log_interaction(state.get("input", "No input"), state.get("formatted_response", ""))
      return state

def update_memory(state: Dict) -> Dict:
      print(f"update_memory - State: {state or 'None'}")
      state = state or {}
      if "history" not in state:
          state["history"] = []
      input_val = state.get("input", "")
      formatted_response = state.get("formatted_response", "")
      if input_val and formatted_response:
          state["history"].append({"user": input_val, "assistant": formatted_response})
      return state

def return_response(state: Dict) -> Dict:
      print(f"return_response - State: {state or 'None'}")
      return state or {}