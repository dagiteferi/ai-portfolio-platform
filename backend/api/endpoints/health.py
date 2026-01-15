from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime

from backend.api.dependencies import get_db

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """
    Health check endpoint.
    
    Checks:
    - API is running
    - Database connection is active
    
    Returns:
        dict: Health status information
    """
    try:
        # Check database connection
        db.execute(text("SELECT 1"))
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "connected",
            "api": "running"
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "unhealthy",
                "timestamp": datetime.utcnow().isoformat(),
                "database": "disconnected",
                "api": "running",
                "error": str(e)
            }
        )


@router.get("/health/db")
async def database_health(db: Session = Depends(get_db)):
    """
    Detailed database health check.
    
    Returns:
        dict: Database connection status
    """
    try:
        result = db.execute(text("SELECT version()"))
        version = result.scalar()
        
        return {
            "status": "connected",
            "database_version": version,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "disconnected",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
        )
