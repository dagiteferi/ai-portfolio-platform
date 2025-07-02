from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ...ai_core.agent.graph import create_chatbot_graph
from typing import Dict
import redis
import json

router = APIRouter()

# Redis client for session storage
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

class ChatRequest(BaseModel):
    query: str
    session_id: str
    user_name: str = None

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        graph = create_chatbot_graph()
        # Retrieve existing state or create a new one
        state_json = redis_client.get(request.session_id)
        if state_json is None:
            state_dict = {
                "session_id": request.session_id,
                "user_name": request.user_name,
                "input": request.query,
                "is_recruiter": False,
                "role_confidence": {"visitor": 0.0, "recruiter": 0.0},
                "role_identified": False,
                "system_prompt": "",
                "minimal_prompt": "",
                "retrieved_docs": [],
                "raw_response": "",
                "formatted_response": "",
                "history": [],
                "continue_conversation": True,
                "tokens_used_in_session": 0,
                "token_budget": 500
            }
            print(f"New state created: {state_dict}")
        else:
            state_dict = json.loads(state_json)
            print(f"State loaded from Redis: {state_dict}")
            # Ensure new keys are present in existing states
            state_dict.setdefault("tokens_used_in_session", 0)
            state_dict.setdefault("token_budget", 500)
            print(f"State after setdefault: {state_dict}")
            state_dict["input"] = request.query
            state_dict["continue_conversation"] = True
            print(f"State after updating input: {state_dict}")

        print(f"Before invoke - Initial state: {state_dict}")
        # Pass the entire state_dict as input to avoid overwriting
        updated_state_dict = graph.invoke(state_dict, state_dict)
        print(f"After invoke - Updated state: {updated_state_dict}")

        # Store the updated state in Redis
        redis_client.set(request.session_id, json.dumps(updated_state_dict))

        return {"response": updated_state_dict.get("formatted_response", "No response generated")}
    except Exception as e:
        print(f"Exception caught: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")