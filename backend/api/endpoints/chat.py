from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.ai_core.agent.graph import create_chatbot_graph

router = APIRouter()

class ChatRequest(BaseModel):
      user_name: str
      session_id: str
      message: str

@router.post("/chat")
async def chat(request: ChatRequest):
      try:
          print(f"Received request: {request.dict()}")
          graph = create_chatbot_graph()
          print("Graph created successfully")
          state = {
              "user_name": request.user_name,
              "session_id": request.session_id,
              "input": request.message,
              "history": [],
              "tokens_used_in_session": 0
          }
          print(f"Initial state: {state}")
          result = graph.invoke(state)
          print(f"Graph invocation result: {result}")
          return {"response": result.get("formatted_response", "No response generated.")}
      except Exception as e:
          print(f"Error in chat endpoint: {str(e)}")
          import traceback
          traceback.print_exc()
          raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")