# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# from ...ai_core.agent.graph import create_chatbot_graph
# from ...ai_core.agent.state import ChatState

# router = APIRouter()

# class ChatRequest(BaseModel):
#     """Request model for the /chat endpoint."""
#     query: str
#     session_id: str
#     user_name: str = None

# @router.post("/chat")
# async def chat(request: ChatRequest):
#     """
#     Handles user chat requests and returns the chatbot's response.
    
#     Args:
#         request (ChatRequest): The incoming request with query, session ID, and user name.
    
#     Returns:
#         dict: Response containing the chatbot's reply.
#     """
#     try:
#         graph = create_chatbot_graph()
#         state = ChatState(session_id=request.session_id, user_name=request.user_name)
#         input_data = {"query": request.query, "user_name": request.user_name}
#         state = graph.invoke(input_data, state)
#         return {"response": state.formatted_response}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ...ai_core.agent.graph import create_chatbot_graph

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    session_id: str
    user_name: str = None

@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        graph = create_chatbot_graph()
        state_dict = {
            "session_id": request.session_id,
            "user_name": request.user_name,
            "input": request.query,
            "is_recruiter": False,
            "system_prompt": "",
            "retrieved_docs": [],
            "raw_response": "",
            "formatted_response": "",
            "history": [],
            "continue_conversation": True
        }
        print(f"Before invoke - Initial state: {state_dict}")
        # Pass input as part of the first argument to ensure it's not cleared
        updated_state_dict = graph.invoke({"input": request.query, "user_name": request.user_name}, state_dict)
        print(f"After invoke - Updated state: {updated_state_dict}")
        return {"response": updated_state_dict.get("formatted_response", "No response generated")}
    except Exception as e:
        print(f"Exception caught: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")