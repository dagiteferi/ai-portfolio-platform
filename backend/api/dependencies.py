"""
Common dependencies and utilities for API endpoints.
"""
from typing import TypeVar, Type

from fastapi import HTTPException
from sqlalchemy.orm import Session

from backend.database import SessionLocal

T = TypeVar('T')


def get_db():
    """
    Database session dependency.
    Yields a database session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_object_or_404(db: Session, model: Type[T], object_id: int) -> T:
    """
    Get an object by ID or raise 404.
    
    Args:
        db: Database session
        model: SQLAlchemy model class
        object_id: ID of the object to retrieve
        
    Returns:
        The requested object
        
    Raises:
        HTTPException: 404 if object not found
    """
    obj = db.query(model).filter(model.id == object_id).first()
    
    if not obj:
        raise HTTPException(
            status_code=404,
            detail=f"{model.__name__} with id {object_id} not found"
        )
    
    return obj
