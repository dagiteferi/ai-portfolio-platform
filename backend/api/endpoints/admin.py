from fastapi import APIRouter, Depends, HTTPException, status
from dotenv import load_dotenv
import os

load_dotenv()

admin_username = os.getenv("ADMIN_USERNAME")
admin_password = os.getenv("ADMIN_PASSWORD")

router = APIRouter()

def authenticate_admin(username: str, password: str):
    if username == admin_username and password == admin_password:
        return True
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

@router.post("/admin/login")
async def admin_login(username: str, password: str):
    authenticate_admin(username, password)
    return {"message": "Login successful"}

@router.get("/admin/chats")
async def get_chat_logs(authenticated: bool = Depends(authenticate_admin)):
    # Placeholder for retrieving chat logs
    return {"message": "Chat logs endpoint (to be implemented)"}

@router.post("/admin/content")
async def post_content(content: str, authenticated: bool = Depends(authenticate_admin)):
    # Placeholder for posting content to the website
    return {"message": f"Content '{content}' posted (to be implemented)"}
