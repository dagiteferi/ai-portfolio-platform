from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

# Load environment variables
dotenv_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))),
    '.env'
)
load_dotenv(dotenv_path=dotenv_path)

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_DAYS = int(os.getenv("JWT_EXPIRE_DAYS", "30"))

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")


if not SECRET_KEY:
    raise ValueError(
        "JWT_SECRET_KEY must be set in .env file. "
        "Generate a secure key with: python -c 'import secrets; print(secrets.token_urlsafe(32))'"
    )

if not ADMIN_USERNAME or not ADMIN_PASSWORD:
    raise ValueError("ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env file")

if len(SECRET_KEY) < 32:
    import warnings
    warnings.warn(
        "JWT_SECRET_KEY is too short. Use at least 32 characters for production. "
        "Generate with: python -c 'import secrets; print(secrets.token_urlsafe(32))'",
        UserWarning
    )


security = HTTPBearer()


def verify_credentials(username: str, password: str) -> bool:
    """
    Verify admin credentials against environment variables.
    """
    return username == ADMIN_USERNAME and password == ADMIN_PASSWORD


def create_access_token(username: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    """
    to_encode = {"sub": username}
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Dependency to verify JWT token and return admin username.
    
    """
    token = credentials.credentials
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        
        if username is None or username != ADMIN_USERNAME:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return username
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Convenience dependency for endpoints that just need authentication
async def require_admin(admin: str = Depends(get_current_admin)) -> bool:
    """
  
    """
    return True
