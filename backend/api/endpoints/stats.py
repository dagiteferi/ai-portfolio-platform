from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database import SessionLocal
from backend.models import sql_models as models

router = APIRouter(tags=["stats"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_projects = db.query(func.count(models.Project.id)).scalar()
    total_skills = db.query(func.count(models.TechnicalSkill.id)).scalar()
    
    ai_ml_projects = db.query(func.count(models.Project.id)).filter(
        models.Project.category == "AI/ML"
    ).scalar()
    
    data_solutions = db.query(func.count(models.Project.id)).filter(
        models.Project.category == "Data Solutions"
    ).scalar()
    
    return {
        "totalProjects": total_projects or 0,
        "totalSkills": total_skills or 0,
        "aiMlProjects": ai_ml_projects or 0,
        "dataSolutions": data_solutions or 0
    }
