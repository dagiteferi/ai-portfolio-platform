"""
Admin API endpoints.
Provides authentication and CRUD operations for portfolio content management.
"""
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, UploadFile, File, Form
from pydantic import BaseModel
from sqlalchemy.orm import Session
import asyncio
import json
import os
from collections import defaultdict

# Local imports
from backend.api.auth.jwt import (
    verify_credentials,
    create_access_token,
    require_admin,
    ACCESS_TOKEN_EXPIRE_DAYS
)
from backend.api.dependencies import get_db, get_object_or_404
from backend.models import sql_models as models
from backend.models import schemas
from backend.services.file_upload import FileUploadService

router = APIRouter()


# ============================================================================
# Authentication Endpoints
# ============================================================================

class LoginRequest(BaseModel):
    """Login request schema."""
    username: str
    password: str


class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"


@router.post("/admin/login", response_model=TokenResponse)
async def admin_login(request: LoginRequest):
    """
    Authenticate admin and return JWT token.
    Token is valid for 30 days.
    """
    if not verify_credentials(request.username, request.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        username=request.username,
        expires_delta=timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


# ============================================================================
# Legacy Endpoints (Chat Logs, Content)
# ============================================================================

@router.get("/admin/chats")
async def get_chat_logs(authenticated: bool = Depends(require_admin)):
    """Get chat logs (placeholder for future implementation)."""
    return {"message": "Chat logs endpoint (to be implemented)"}


@router.post("/admin/content")
async def post_content(
    content: str,
    authenticated: bool = Depends(require_admin)
):
    """Post content to website (placeholder for future implementation)."""
    return {"message": f"Content '{content}' posted (to be implemented)"}


# ============================================================================
# Log File Management
# ============================================================================

@router.get("/admin/logs", response_model=List[str])
async def list_log_files(authenticated: bool = Depends(require_admin)):
    """List all available log files."""
    from backend.main import LOGS_DIR as log_dir
    
    try:
        log_files = [
            f for f in os.listdir(log_dir)
            if os.path.isfile(os.path.join(log_dir, f))
        ]
        return log_files
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Log directory not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing log files: {e}")


@router.get("/admin/logs/{filename}")
async def get_log_file_content(
    filename: str,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    authenticated: bool = Depends(require_admin)
):
    """
    Retrieve content from a specific log file with pagination.
    Logs are parsed by log level.
    """
    from backend.main import LOGS_DIR as log_dir
    
    file_path = os.path.join(log_dir, filename)
    
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="Log file not found")
    
    try:
        with open(file_path, 'r') as f:
            paginated_lines = []
            
            # Skip to offset and read limit lines
            for i, line in enumerate(f):
                if i < offset:
                    continue
                if i >= offset + limit:
                    break
                paginated_lines.append(line)
            
            # Parse logs by level
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
        raise HTTPException(
            status_code=500,
            detail=f"Error reading or parsing file: {str(e)}"
        )


@router.websocket("/admin/logs/stream/{filename}")
async def stream_log_file(websocket: WebSocket, filename: str):
    """Stream logs from a specific file in real-time."""
    await websocket.accept()
    
    from backend.main import LOGS_DIR as log_dir
    file_path = os.path.join(log_dir, filename)
    
    if not os.path.isfile(file_path):
        await websocket.close(code=4004, reason="Log file not found")
        return
    
    try:
        with open(file_path, 'r') as f:
            # Go to end of file to only read new lines
            f.seek(0, 2)
            
            while True:
                line = f.readline()
                if not line:
                    await asyncio.sleep(0.5)
                    continue
                await websocket.send_text(line)
    except Exception:
        pass  # Silently close on disconnect


# ============================================================================
# CV Management
# ============================================================================

@router.post("/admin/cv/upload", response_model=schemas.CVResponse)
async def upload_cv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Upload a new CV file to Supabase storage."""
    public_url = await FileUploadService.upload_cv(file)
    
    db_cv = models.CV(url=public_url)
    db.add(db_cv)
    db.commit()
    db.refresh(db_cv)
    
    return db_cv


@router.get("/admin/cv", response_model=List[schemas.CVResponse])
async def get_cvs(db: Session = Depends(get_db)):
    """Get all CV records."""
    return db.query(models.CV).all()


@router.delete("/admin/cv/{cv_id}")
async def delete_cv(
    cv_id: int,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Delete a CV record."""
    db_cv = get_object_or_404(db, models.CV, cv_id)
    db.delete(db_cv)
    db.commit()
    
    return {"message": "CV deleted successfully"}


# ============================================================================
# Technical Skills Management
# ============================================================================

@router.post("/admin/skills", response_model=schemas.TechnicalSkillResponse)
async def create_skill(
    skill: schemas.TechnicalSkillCreate,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new technical skill."""
    db_skill = models.TechnicalSkill(**skill.dict())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    
    return db_skill


@router.post("/admin/skills/upload", response_model=schemas.TechnicalSkillResponse)
async def upload_skill(
    file: UploadFile = File(...),
    name: str = Form(...),
    category: Optional[str] = Form(None),
    proficiency: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new skill with icon upload."""
    icon_url = await FileUploadService.upload_image(file, "icon_")
    
    db_skill = models.TechnicalSkill(
        name=name,
        category=category,
        proficiency=proficiency,
        icon=icon_url
    )
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    
    return db_skill


@router.get("/admin/skills", response_model=List[schemas.TechnicalSkillResponse])
async def get_skills(db: Session = Depends(get_db)):
    """Get all technical skills."""
    return db.query(models.TechnicalSkill).all()


@router.put("/admin/skills/{skill_id}", response_model=schemas.TechnicalSkillResponse)
async def update_skill(
    skill_id: int,
    skill: schemas.TechnicalSkillUpdate,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """
    Update a technical skill (partial update supported).
    Only provided fields will be updated.
    """
    db_skill = get_object_or_404(db, models.TechnicalSkill, skill_id)
    
    for key, value in skill.dict(exclude_unset=True).items():
        setattr(db_skill, key, value)
    
    db.commit()
    db.refresh(db_skill)
    
    return db_skill


@router.delete("/admin/skills/{skill_id}")
async def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Delete a technical skill."""
    db_skill = get_object_or_404(db, models.TechnicalSkill, skill_id)
    db.delete(db_skill)
    db.commit()
    
    return {"message": "Skill deleted successfully"}


# ============================================================================
# Education Management
# ============================================================================

@router.post("/admin/education", response_model=schemas.EducationResponse)
async def create_education(
    education: schemas.EducationCreate,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new education entry."""
    db_education = models.Education(**education.dict())
    db.add(db_education)
    db.commit()
    db.refresh(db_education)
    
    return db_education


@router.get("/admin/education", response_model=List[schemas.EducationResponse])
async def get_education(db: Session = Depends(get_db)):
    """Get all education entries."""
    return db.query(models.Education).all()


@router.put("/admin/education/{education_id}", response_model=schemas.EducationResponse)
async def update_education(
    education_id: int,
    education: schemas.EducationUpdate,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """
    Update an education entry (partial update supported).
    Only provided fields will be updated.
    """
    db_education = get_object_or_404(db, models.Education, education_id)
    
    for key, value in education.dict(exclude_unset=True).items():
        setattr(db_education, key, value)
    
    db.commit()
    db.refresh(db_education)
    
    return db_education


@router.delete("/admin/education/{education_id}")
async def delete_education(
    education_id: int,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Delete an education entry."""
    db_education = get_object_or_404(db, models.Education, education_id)
    db.delete(db_education)
    db.commit()
    
    return {"message": "Education entry deleted successfully"}


# ============================================================================
# Certificate Management
# ============================================================================

@router.post("/admin/certificates", response_model=schemas.CertificateResponse)
async def create_certificate(
    certificate: schemas.CertificateCreate,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new certificate."""
    db_certificate = models.Certificate(**certificate.dict())
    db.add(db_certificate)
    db.commit()
    db.refresh(db_certificate)
    
    return db_certificate


@router.post("/admin/certificates/upload", response_model=schemas.CertificateResponse)
async def upload_certificate(
    file: UploadFile = File(...),
    title: str = Form(...),
    issuer: str = Form(...),
    date_issued_str: Optional[str] = Form(None, alias="date_issued"),
    description: Optional[str] = Form(None),
    is_professional: bool = Form(False),
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new certificate with file upload."""
    cert_url = await FileUploadService.upload_certificate(file)
    
    # Parse date
    parsed_date = None
    if date_issued_str:
        try:
            parsed_date = datetime.strptime(date_issued_str, "%Y-%m-%d").date()
        except ValueError:
            pass
    
    db_certificate = models.Certificate(
        title=title,
        issuer=issuer,
        date_issued=parsed_date,
        description=description,
        is_professional=is_professional,
        url=cert_url
    )
    db.add(db_certificate)
    db.commit()
    db.refresh(db_certificate)
    
    return db_certificate


@router.get("/admin/certificates", response_model=List[schemas.CertificateResponse])
async def get_certificates(db: Session = Depends(get_db)):
    """Get all certificates."""
    return db.query(models.Certificate).all()


@router.put("/admin/certificates/{certificate_id}", response_model=schemas.CertificateResponse)
async def update_certificate(
    certificate_id: int,
    file: Optional[UploadFile] = File(None),
    title: Optional[str] = Form(None),
    issuer: Optional[str] = Form(None),
    date_issued_str: Optional[str] = Form(None, alias="date_issued"),
    description: Optional[str] = Form(None),
    is_professional: Optional[bool] = Form(None),
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """
    Update a certificate (partial update supported).
    Optionally upload a new certificate file.
    """
    db_certificate = get_object_or_404(db, models.Certificate, certificate_id)
    
    # Upload new file if provided
    if file:
        db_certificate.url = await FileUploadService.upload_certificate(file)
    
    # Update other fields
    if title is not None:
        db_certificate.title = title
    if issuer is not None:
        db_certificate.issuer = issuer
    if description is not None:
        db_certificate.description = description
    if is_professional is not None:
        db_certificate.is_professional = is_professional
    if date_issued_str is not None:
        try:
            db_certificate.date_issued = datetime.strptime(date_issued_str, "%Y-%m-%d").date()
        except ValueError:
            pass
    
    db.commit()
    db.refresh(db_certificate)
    
    return db_certificate


@router.delete("/admin/certificates/{certificate_id}")
async def delete_certificate(
    certificate_id: int,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Delete a certificate."""
    db_certificate = get_object_or_404(db, models.Certificate, certificate_id)
    db.delete(db_certificate)
    db.commit()
    
    return {"message": "Certificate deleted successfully"}


# ============================================================================
# Memorable Moments Management
# ============================================================================

@router.post("/admin/moments", response_model=schemas.MemorableMomentResponse)
async def create_moment(
    moment: schemas.MemorableMomentCreate,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new memorable moment."""
    db_moment = models.MemorableMoment(**moment.dict())
    db.add(db_moment)
    db.commit()
    db.refresh(db_moment)
    
    return db_moment


@router.post("/admin/moments/upload", response_model=schemas.MemorableMomentResponse)
async def upload_moment(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    date_str: Optional[str] = Form(None, alias="date"),
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new memorable moment with image upload."""
    image_url = await FileUploadService.upload_image(file, "moment_")
    
    # Parse date
    parsed_date = None
    if date_str:
        try:
            parsed_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            pass
    
    db_moment = models.MemorableMoment(
        title=title,
        description=description,
        date=parsed_date,
        image_url=image_url
    )
    db.add(db_moment)
    db.commit()
    db.refresh(db_moment)
    
    return db_moment


@router.get("/admin/moments", response_model=List[schemas.MemorableMomentResponse])
async def get_moments(db: Session = Depends(get_db)):
    """Get all memorable moments."""
    return db.query(models.MemorableMoment).all()


@router.put("/admin/moments/{moment_id}", response_model=schemas.MemorableMomentResponse)
async def update_moment(
    moment_id: int,
    file: Optional[UploadFile] = File(None),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    date_str: Optional[str] = Form(None, alias="date"),
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """
    Update a memorable moment (partial update supported).
    Optionally upload a new image.
    """
    db_moment = get_object_or_404(db, models.MemorableMoment, moment_id)
    
    # Upload new image if provided
    if file:
        db_moment.image_url = await FileUploadService.upload_image(file, "moment_")
    
    # Update other fields
    if title is not None:
        db_moment.title = title
    if description is not None:
        db_moment.description = description
    if date_str is not None:
        try:
            db_moment.date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            pass
    
    db.commit()
    db.refresh(db_moment)
    
    return db_moment


@router.delete("/admin/moments/{moment_id}")
async def delete_moment(
    moment_id: int,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Delete a memorable moment."""
    db_moment = get_object_or_404(db, models.MemorableMoment, moment_id)
    db.delete(db_moment)
    db.commit()
    
    return {"message": "Moment deleted successfully"}


# ============================================================================
# Work Experience Management
# ============================================================================

@router.post("/admin/experience", response_model=schemas.WorkExperienceResponse)
async def create_experience(
    experience: schemas.WorkExperienceCreate,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new work experience entry."""
    db_experience = models.WorkExperience(**experience.dict())
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    
    return db_experience


@router.get("/admin/experience", response_model=List[schemas.WorkExperienceResponse])
async def get_experience(db: Session = Depends(get_db)):
    """Get all work experience entries."""
    return db.query(models.WorkExperience).all()


@router.put("/admin/experience/{experience_id}", response_model=schemas.WorkExperienceResponse)
async def update_experience(
    experience_id: int,
    experience: schemas.WorkExperienceUpdate,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """
    Update a work experience entry (partial update supported).
    Only provided fields will be updated.
    """
    db_experience = get_object_or_404(db, models.WorkExperience, experience_id)
    
    for key, value in experience.dict(exclude_unset=True).items():
        setattr(db_experience, key, value)
    
    db.commit()
    db.refresh(db_experience)
    
    return db_experience


@router.delete("/admin/experience/{experience_id}")
async def delete_experience(
    experience_id: int,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Delete a work experience entry."""
    db_experience = get_object_or_404(db, models.WorkExperience, experience_id)
    db.delete(db_experience)
    db.commit()
    
    return {"message": "Experience entry deleted successfully"}


# ============================================================================
# Project Management
# ============================================================================

@router.post("/admin/projects", response_model=schemas.ProjectResponse)
async def create_project(
    project: schemas.ProjectCreate,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new project."""
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return db_project


@router.post("/admin/projects/upload", response_model=schemas.ProjectResponse)
async def upload_project(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    technologies: Optional[str] = Form(None),
    project_url: Optional[str] = Form(None),
    github_url: Optional[str] = Form(None),
    is_featured: bool = Form(False),
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new project with image upload."""
    image_url = await FileUploadService.upload_image(file, "project_")
    
    db_project = models.Project(
        title=title,
        description=description,
        technologies=technologies,
        project_url=project_url,
        github_url=github_url,
        is_featured=is_featured,
        image_url=image_url
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    
    return db_project


@router.get("/admin/projects", response_model=List[schemas.ProjectResponse])
async def get_projects(db: Session = Depends(get_db)):
    """Get all projects."""
    return db.query(models.Project).all()


@router.put("/admin/projects/{project_id}", response_model=schemas.ProjectResponse)
async def update_project(
    project_id: int,
    file: Optional[UploadFile] = File(None),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    technologies: Optional[str] = Form(None),
    project_url: Optional[str] = Form(None),
    github_url: Optional[str] = Form(None),
    is_featured: Optional[bool] = Form(None),
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """
    Update a project (partial update supported).
    Optionally upload a new project image.
    """
    db_project = get_object_or_404(db, models.Project, project_id)
    
    # Upload new image if provided
    if file:
        db_project.image_url = await FileUploadService.upload_image(file, "project_")
    
    # Update other fields
    if title is not None:
        db_project.title = title
    if description is not None:
        db_project.description = description
    if technologies is not None:
        db_project.technologies = technologies
    if project_url is not None:
        db_project.project_url = project_url
    if github_url is not None:
        db_project.github_url = github_url
    if is_featured is not None:
        db_project.is_featured = is_featured
    
    db.commit()
    db.refresh(db_project)
    
    return db_project


@router.delete("/admin/projects/{project_id}")
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Delete a project."""
    db_project = get_object_or_404(db, models.Project, project_id)
    db.delete(db_project)
    db.commit()
    
    return {"message": "Project deleted successfully"}