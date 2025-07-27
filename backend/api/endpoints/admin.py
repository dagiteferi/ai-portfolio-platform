from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# Construct the path to the .env file in the project root
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env')
load_dotenv(dotenv_path=dotenv_path)

admin_username = os.getenv("ADMIN_USERNAME")
admin_password = os.getenv("ADMIN_PASSWORD")

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

def authenticate_admin(username: str, password: str):
    if username == admin_username and password == admin_password:
        return True
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

@router.post("/admin/login")
async def admin_login(request: LoginRequest):
    authenticate_admin(request.username, request.password)
    return {"message": "Login successful"}

@router.get("/admin/chats")
async def get_chat_logs(authenticated: bool = Depends(authenticate_admin)):
    # Placeholder for retrieving chat logs
    return {"message": "Chat logs endpoint (to be implemented)"}

import os

@router.post("/admin/content")
async def post_content(content: str, authenticated: bool = Depends(authenticate_admin)):
    # Placeholder for posting content to the website
    return {"message": f"Content '{content}' posted (to be implemented)"}

@router.get("/admin/logs")
async def get_admin_logs(authenticated: bool = Depends(authenticate_admin)):
    log_dir = "/home/dagi/Documents/ai-portfolio-platform/logs"
    log_files = []
    try:
        for filename in os.listdir(log_dir):
            if os.path.isfile(os.path.join(log_dir, filename)):
                log_files.append(filename)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Log directory not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing log files: {e}")

    logs_content = {}
    for filename in log_files:
        file_path = os.path.join(log_dir, filename)
        try:
            with open(file_path, 'r') as f:
                logs_content[filename] = f.read()
        except Exception as e:
            logs_content[filename] = f"Error reading file: {e}"
    return {"logs": logs_content}
