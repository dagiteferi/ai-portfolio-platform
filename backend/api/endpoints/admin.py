from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import json
from collections import defaultdict
from typing import List, Dict, Any

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

@router.post("/admin/content")
async def post_content(content: str, authenticated: bool = Depends(authenticate_admin)):
    # Placeholder for posting content to the website
    return {"message": f"Content '{content}' posted (to be implemented)"}

@router.get("/admin/logs", response_model=List[str])
async def list_log_files(authenticated: bool = Depends(authenticate_admin)):
    """
    Lists all available log files.
    """
    from backend.main import LOGS_DIR as log_dir
    try:
        log_files = [f for f in os.listdir(log_dir) if os.path.isfile(os.path.join(log_dir, f))]
        return log_files
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Log directory not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing log files: {e}")

@router.get("/admin/logs/{filename}", response_model=Dict[str, Any])
async def get_log_file_content(
    filename: str,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    authenticated: bool = Depends(authenticate_admin)
):
    """
    Retrieves content from a specific log file with pagination.
    Logs are parsed by log level.
    """
    from backend.main import LOGS_DIR as log_dir
    
    file_path = os.path.join(log_dir, filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="Log file not found")

    try:
        with open(file_path, 'r') as f:
            paginated_lines = []
            # Skip to the offset
            for i, line in enumerate(f):
                if i < offset:
                    continue
                if i >= offset + limit:
                    break
                paginated_lines.append(line)

            parsed_logs = defaultdict(list)
            for line in paginated_lines:
                try:
                    log_entry = json.loads(line)
                    log_level = log_entry.get("log_level", "unknown")
                    parsed_logs[log_level].append(log_entry)
                except json.JSONDecodeError:
                    parsed_logs["parsing_errors"].append(line.strip())
            
            return {
                "filename": filename,
                "limit": limit,
                "offset": offset,
                "logs": parsed_logs
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading or parsing file: {str(e)}")
