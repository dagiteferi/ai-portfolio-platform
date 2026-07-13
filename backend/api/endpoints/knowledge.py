from fastapi import APIRouter, Depends, HTTPException
from backend.api.auth.jwt import require_admin
from backend.services.knowledge_refresh import (
    get_knowledge_status,
    full_rebuild,
)

router = APIRouter()


@router.get("/knowledge/status", tags=["Knowledge"])
def knowledge_status():
    """Status of the RAG knowledge base (no DB polling)."""
    return get_knowledge_status()


@router.post("/admin/knowledge/refresh", tags=["Knowledge"])
def refresh_knowledge(authenticated: bool = Depends(require_admin)):
    """
    Force a full rebuild from DB + static sources.
    Normal updates happen automatically via change capture on admin writes.
    """
    try:
        full_rebuild()
        return {
            "message": "Knowledge base fully rebuilt",
            **get_knowledge_status(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to refresh knowledge base: {e}")
