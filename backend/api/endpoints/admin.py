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

# --- CRUD Operations ---

from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import sql_models as models
from backend.models import schemas

# Helper function to get object or 404
def get_object_or_404(db: Session, model, object_id: int):
    obj = db.query(model).filter(model.id == object_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    return obj

# --- CV ---
@router.post("/admin/cv", response_model=schemas.CVResponse)
async def create_cv(cv: schemas.CVCreate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_cv = models.CV(**cv.dict())
    db.add(db_cv)
    db.commit()
    db.refresh(db_cv)
    return db_cv

@router.get("/admin/cv", response_model=List[schemas.CVResponse])
async def get_cvs(db: Session = Depends(get_db)):
    return db.query(models.CV).all()

@router.put("/admin/cv/{cv_id}", response_model=schemas.CVResponse)
async def update_cv(cv_id: int, cv: schemas.CVUpdate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_cv = get_object_or_404(db, models.CV, cv_id)
    for key, value in cv.dict(exclude_unset=True).items():
        setattr(db_cv, key, value)
    db.commit()
    db.refresh(db_cv)
    return db_cv

@router.delete("/admin/cv/{cv_id}")
async def delete_cv(cv_id: int, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_cv = get_object_or_404(db, models.CV, cv_id)
    db.delete(db_cv)
    db.commit()
    return {"message": "CV deleted successfully"}

# --- Technical Skills ---
@router.post("/admin/skills", response_model=schemas.TechnicalSkillResponse)
async def create_skill(skill: schemas.TechnicalSkillCreate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_skill = models.TechnicalSkill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.get("/admin/skills", response_model=List[schemas.TechnicalSkillResponse])
async def get_skills(db: Session = Depends(get_db)):
    return db.query(models.TechnicalSkill).all()

@router.put("/admin/skills/{skill_id}", response_model=schemas.TechnicalSkillResponse)
async def update_skill(skill_id: int, skill: schemas.TechnicalSkillUpdate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_skill = get_object_or_404(db, models.TechnicalSkill, skill_id)
    for key, value in skill.dict(exclude_unset=True).items():
        setattr(db_skill, key, value)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@router.delete("/admin/skills/{skill_id}")
async def delete_skill(skill_id: int, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_skill = get_object_or_404(db, models.TechnicalSkill, skill_id)
    db.delete(db_skill)
    db.commit()
    return {"message": "Skill deleted successfully"}

# --- Education ---
@router.post("/admin/education", response_model=schemas.EducationResponse)
async def create_education(education: schemas.EducationCreate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_education = models.Education(**education.dict())
    db.add(db_education)
    db.commit()
    db.refresh(db_education)
    return db_education

@router.get("/admin/education", response_model=List[schemas.EducationResponse])
async def get_education(db: Session = Depends(get_db)):
    return db.query(models.Education).all()

@router.put("/admin/education/{education_id}", response_model=schemas.EducationResponse)
async def update_education(education_id: int, education: schemas.EducationUpdate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_education = get_object_or_404(db, models.Education, education_id)
    for key, value in education.dict(exclude_unset=True).items():
        setattr(db_education, key, value)
    db.commit()
    db.refresh(db_education)
    return db_education

@router.delete("/admin/education/{education_id}")
async def delete_education(education_id: int, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_education = get_object_or_404(db, models.Education, education_id)
    db.delete(db_education)
    db.commit()
    return {"message": "Education entry deleted successfully"}

# --- Certificates ---
@router.post("/admin/certificates", response_model=schemas.CertificateResponse)
async def create_certificate(certificate: schemas.CertificateCreate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_certificate = models.Certificate(**certificate.dict())
    db.add(db_certificate)
    db.commit()
    db.refresh(db_certificate)
    return db_certificate

@router.get("/admin/certificates", response_model=List[schemas.CertificateResponse])
async def get_certificates(db: Session = Depends(get_db)):
    return db.query(models.Certificate).all()

@router.put("/admin/certificates/{certificate_id}", response_model=schemas.CertificateResponse)
async def update_certificate(certificate_id: int, certificate: schemas.CertificateUpdate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_certificate = get_object_or_404(db, models.Certificate, certificate_id)
    for key, value in certificate.dict(exclude_unset=True).items():
        setattr(db_certificate, key, value)
    db.commit()
    db.refresh(db_certificate)
    return db_certificate

@router.delete("/admin/certificates/{certificate_id}")
async def delete_certificate(certificate_id: int, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_certificate = get_object_or_404(db, models.Certificate, certificate_id)
    db.delete(db_certificate)
    db.commit()
    return {"message": "Certificate deleted successfully"}

# --- Memorable Moments ---
@router.post("/admin/moments", response_model=schemas.MemorableMomentResponse)
async def create_moment(moment: schemas.MemorableMomentCreate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_moment = models.MemorableMoment(**moment.dict())
    db.add(db_moment)
    db.commit()
    db.refresh(db_moment)
    return db_moment

@router.get("/admin/moments", response_model=List[schemas.MemorableMomentResponse])
async def get_moments(db: Session = Depends(get_db)):
    return db.query(models.MemorableMoment).all()

@router.put("/admin/moments/{moment_id}", response_model=schemas.MemorableMomentResponse)
async def update_moment(moment_id: int, moment: schemas.MemorableMomentUpdate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_moment = get_object_or_404(db, models.MemorableMoment, moment_id)
    for key, value in moment.dict(exclude_unset=True).items():
        setattr(db_moment, key, value)
    db.commit()
    db.refresh(db_moment)
    return db_moment

@router.delete("/admin/moments/{moment_id}")
async def delete_moment(moment_id: int, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_moment = get_object_or_404(db, models.MemorableMoment, moment_id)
    db.delete(db_moment)
    db.commit()
    return {"message": "Moment deleted successfully"}

# --- Work Experience ---
@router.post("/admin/experience", response_model=schemas.WorkExperienceResponse)
async def create_experience(experience: schemas.WorkExperienceCreate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_experience = models.WorkExperience(**experience.dict())
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience

@router.get("/admin/experience", response_model=List[schemas.WorkExperienceResponse])
async def get_experience(db: Session = Depends(get_db)):
    return db.query(models.WorkExperience).all()

@router.put("/admin/experience/{experience_id}", response_model=schemas.WorkExperienceResponse)
async def update_experience(experience_id: int, experience: schemas.WorkExperienceUpdate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_experience = get_object_or_404(db, models.WorkExperience, experience_id)
    for key, value in experience.dict(exclude_unset=True).items():
        setattr(db_experience, key, value)
    db.commit()
    db.refresh(db_experience)
    return db_experience

@router.delete("/admin/experience/{experience_id}")
async def delete_experience(experience_id: int, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_experience = get_object_or_404(db, models.WorkExperience, experience_id)
    db.delete(db_experience)
    db.commit()
    return {"message": "Experience entry deleted successfully"}

# --- Projects ---
@router.post("/admin/projects", response_model=schemas.ProjectResponse)
async def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/admin/projects", response_model=List[schemas.ProjectResponse])
async def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@router.put("/admin/projects/{project_id}", response_model=schemas.ProjectResponse)
async def update_project(project_id: int, project: schemas.ProjectUpdate, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_project = get_object_or_404(db, models.Project, project_id)
    for key, value in project.dict(exclude_unset=True).items():
        setattr(db_project, key, value)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/admin/projects/{project_id}")
async def delete_project(project_id: int, db: Session = Depends(get_db), authenticated: bool = Depends(authenticate_admin_token)):
    db_project = get_object_or_404(db, models.Project, project_id)
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}