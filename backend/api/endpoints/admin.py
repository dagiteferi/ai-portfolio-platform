from fastapi import APIRouter, Depends, HTTPException, status, Query, WebSocket
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import json
import asyncio
from collections import defaultdict
from typing import List, Dict, Any
import uuid

# Construct the path to the .env file in the project root
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), '.env')
load_dotenv(dotenv_path=dotenv_path)

admin_username = os.getenv("ADMIN_USERNAME")
admin_password = os.getenv("ADMIN_PASSWORD")

router = APIRouter()

# In-memory store for active tokens (for simplicity; use a database in production)
active_tokens: Dict[str, str] = {}

# FastAPI security scheme for Bearer token
security = HTTPBearer()

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

def verify_admin_credentials(username: str, password: str):
    if username == admin_username and password == admin_password:
        return True
    return False

async def authenticate_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if token in active_tokens and active_tokens[token] == admin_username: # Simple token validation
        return True
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )

@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(request: LoginRequest):
    if verify_admin_credentials(request.username, request.password):
        token = str(uuid.uuid4()) # Generate a simple UUID token
        active_tokens[token] = request.username # Store token with username
        return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

@router.get("/admin/chats")
async def get_chat_logs(authenticated: bool = Depends(authenticate_admin_token)):
    # Placeholder for retrieving chat logs
    return {"message": "Chat logs endpoint (to be implemented)"}

@router.post("/admin/content")
async def post_content(content: str, authenticated: bool = Depends(authenticate_admin_token)):
    # Placeholder for posting content to the website
    return {"message": f"Content '{content}' posted (to be implemented)"}

@router.get("/admin/logs", response_model=List[str])
async def list_log_files(authenticated: bool = Depends(authenticate_admin_token)):
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
    authenticated: bool = Depends(authenticate_admin_token)
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

@router.websocket("/admin/logs/stream/{filename}")
async def stream_log_file(websocket: WebSocket, filename: str, authenticated: bool = Depends(authenticate_admin_token)):
    """
    Streams the logs from a specific file in real-time.
    Authentication should be handled via a token in a real-world scenario.
    """
    # The websocket connection itself doesn't directly use Depends for path operations,
    # but we can still validate the token if passed as a query parameter or header.
    # For simplicity, we'll assume the token is validated before establishing the connection
    # or passed as a query param for initial validation if needed.
    # For now, the 'authenticated' dependency is a placeholder for future robust websocket auth.
    
    await websocket.accept()

    from backend.main import LOGS_DIR as log_dir
    file_path = os.path.join(log_dir, filename)

    if not os.path.isfile(file_path):
        await websocket.close(code=4004, reason="Log file not found")
        return

    try:
        with open(file_path, 'r') as f:
            # Go to the end of the file to only read new lines
            f.seek(0, 2)
            while True:
                line = f.readline()
                if not line:
                    # No new line, wait a bit before trying again
                    await asyncio.sleep(0.5)
                    continue
                await websocket.send_text(line)
    except Exception:
        # This will catch errors and client disconnects
        pass # Silently close on disconnect