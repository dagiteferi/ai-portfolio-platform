from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime

from backend.api.dependencies import get_db

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    """
    Lightweight liveness check for Hugging Face / load balancers.
    Does not wait on DB so the container can become healthy quickly.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "api": "running",
    }


@router.get("/health/ready")
async def readiness_check(db: Session = Depends(get_db)):
    """
    Readiness check: API + database connectivity.
    """
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "ready",
            "timestamp": datetime.utcnow().isoformat(),
            "database": "connected",
            "api": "running",
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "not_ready",
                "timestamp": datetime.utcnow().isoformat(),
                "database": "disconnected",
                "api": "running",
                "error": str(e),
            },
        )


@router.get("/health/db")
async def database_health(db: Session = Depends(get_db)):
    """
    Detailed database health check.
    """
    try:
        result = db.execute(text("SELECT version()"))
        version = result.scalar()

        return {
            "status": "connected",
            "database_version": version,
            "timestamp": datetime.utcnow().isoformat(),
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "disconnected",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat(),
            },
        )
