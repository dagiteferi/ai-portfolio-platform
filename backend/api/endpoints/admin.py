"""
Admin API endpoints.
Provides authentication and CRUD operations for portfolio content management.
"""
from datetime import datetime, timedelta
from typing import List, Optional, Union

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
#Authentication Endpoints


class LoginRequest(BaseModel):
    """Login request schema."""
    username: str
    password: str


class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    token_type: str = "bearer"


@router.post("/admin/login", response_model=TokenResponse, tags=["Authentication"])
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


#Legacy Endpoints (Chat Logs, Content)


@router.get("/admin/chats", tags=["Legacy"])
async def get_chat_logs(authenticated: bool = Depends(require_admin)):
    """Get chat logs (placeholder for future implementation)."""
    return {"message": "Chat logs endpoint (to be implemented)"}


@router.post("/admin/content", tags=["Legacy"])
async def post_content(
    content: str,
    authenticated: bool = Depends(require_admin)
):
    """Post content to website (placeholder for future implementation)."""
    return {"message": f"Content '{content}' posted (to be implemented)"}


#Log File Management


@router.get("/admin/logs", response_model=List[str], tags=["Logs"])
def list_log_files(authenticated: bool = Depends(require_admin)):
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


@router.get("/admin/logs/{filename}", tags=["Logs"])
def get_log_file_content(
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


# CV Management


@router.post("/admin/cv/upload", response_model=schemas.CVResponse, tags=["CV"])
async def upload_cv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Upload a new CV file to Supabase storage."""
    import logging
    logger = logging.getLogger(__name__)
    
    logger.info(f"CV upload started - Filename: {getattr(file, 'filename', 'N/A')}")
    
    # Use duck typing instead of isinstance to avoid potential import mismatches
    if file and hasattr(file, 'filename') and file.filename and file.filename.strip():
        try:
            public_url = await FileUploadService.upload_cv(file)
            logger.info(f"CV uploaded to Supabase: {public_url}")
            
            db_cv = models.CV(url=public_url)
            db.add(db_cv)
            db.commit()
            db.refresh(db_cv)
            
            return db_cv
        except Exception as e:
            logger.error(f"Failed to upload CV: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to upload CV: {str(e)}")
    else:
        logger.warning("No valid file provided for CV upload")
        raise HTTPException(status_code=400, detail="No valid file provided")


@router.get("/admin/cv", response_model=List[schemas.CVResponse], tags=["CV"])
def get_cvs(db: Session = Depends(get_db)):
    """Get all CV records."""
    return db.query(models.CV).all()


@router.delete("/admin/cv/{cv_id}", tags=["CV"])
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


#Technical Skills Management


@router.post("/admin/skills", response_model=schemas.TechnicalSkillResponse, tags=["Technical Skills"])
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


@router.post("/admin/skills/upload", response_model=schemas.TechnicalSkillResponse, tags=["Technical Skills"])
async def upload_skill(
    file: UploadFile = File(...),
    name: str = Form(...),
    category: Optional[str] = Form(None),
    proficiency: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new skill with icon upload."""
    import logging
    logger = logging.getLogger(__name__)
    
    icon_url = None
    if file and hasattr(file, 'filename') and file.filename and file.filename.strip():
        try:
            icon_url = await FileUploadService.upload_image(file, "icon_")
        except Exception as e:
            logger.error(f"Failed to upload skill icon: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to upload icon: {str(e)}")
    
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


@router.get("/admin/skills", response_model=List[schemas.TechnicalSkillResponse], tags=["Technical Skills"])
def get_skills(db: Session = Depends(get_db)):
    """Get all technical skills."""
    return db.query(models.TechnicalSkill).all()


@router.put("/admin/skills/{skill_id}", response_model=schemas.TechnicalSkillResponse, tags=["Technical Skills"])
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
    
    # Helper function to check if value should be updated
    def should_update(value):
        """Check if value is meaningful (not None, empty string, or 'string')"""
        if value is None:
            return False
        if isinstance(value, str) and (value == "" or value.lower() == "string"):
            return False
        return True
    
    # Update only fields with meaningful values
    for key, value in skill.dict(exclude_unset=True).items():
        if isinstance(value, str):
            if should_update(value):
                setattr(db_skill, key, value)
        else:
            setattr(db_skill, key, value)
    
    db.commit()
    db.refresh(db_skill)
    
    return db_skill


@router.delete("/admin/skills/{skill_id}", tags=["Technical Skills"])
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


# Education Management


@router.post("/admin/education", response_model=schemas.EducationResponse, tags=["Education"])
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


@router.get("/admin/education", response_model=List[schemas.EducationResponse], tags=["Education"])
def get_education(db: Session = Depends(get_db)):
    """Get all education entries."""
    return db.query(models.Education).all()


@router.put("/admin/education/{education_id}", response_model=schemas.EducationResponse, tags=["Education"])
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
    
    # Helper function to check if value should be updated
    def should_update(value):
        """Check if value is meaningful (not None, empty string, or 'string')"""
        if value is None:
            return False
        if isinstance(value, str) and (value == "" or value.lower() == "string"):
            return False
        return True
    
    # Update only fields with meaningful values
    for key, value in education.dict(exclude_unset=True).items():
        if isinstance(value, str):
            if should_update(value):
                setattr(db_education, key, value)
        else:
            setattr(db_education, key, value)
    
    db.commit()
    db.refresh(db_education)
    
    return db_education


@router.delete("/admin/education/{education_id}", tags=["Education"])
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

# Certificate Management


@router.post("/admin/certificates", response_model=schemas.CertificateResponse, tags=["Certificates"])
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


@router.post("/admin/certificates/upload", response_model=schemas.CertificateResponse, tags=["Certificates"])
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
    import logging
    logger = logging.getLogger(__name__)
    
    cert_url = None
    if file and hasattr(file, 'filename') and file.filename and file.filename.strip():
        try:
            cert_url = await FileUploadService.upload_certificate(file)
        except Exception as e:
            logger.error(f"Failed to upload certificate file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to upload certificate: {str(e)}")
    
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


@router.get("/admin/certificates", response_model=List[schemas.CertificateResponse], tags=["Certificates"])
def get_certificates(db: Session = Depends(get_db)):
    """Get all certificates."""
    return db.query(models.Certificate).all()


@router.put("/admin/certificates/{certificate_id}", response_model=schemas.CertificateResponse, tags=["Certificates"])
async def update_certificate(
    certificate_id: int,
    file: Union[UploadFile, str, None] = File(None),
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
    
    # Helper function to check if value should be updated
    def should_update(value):
        """Check if value is meaningful (not None, empty string, or 'string')"""
        if value is None:
            return False
        if isinstance(value, str) and (value == "" or value.lower() == "string"):
            return False
        return True
    
    import logging
    logger = logging.getLogger(__name__)

    # Upload new file if provided (handle empty string from Swagger)
    logger.info(f"File object received for certificate {certificate_id} - Type: {type(file)}")
    if hasattr(file, 'filename'):
        logger.info(f"Filename: '{file.filename}', Content-type: {getattr(file, 'content_type', 'N/A')}")

    # Use duck typing instead of isinstance to avoid potential import mismatches
    if file and hasattr(file, 'filename') and file.filename and file.filename.strip():
        try:
            logger.info(f"Uploading new certificate for ID {certificate_id}: {file.filename}")
            new_url = await FileUploadService.upload_certificate(file)
            db_certificate.url = new_url
            logger.info(f"Certificate uploaded successfully: {new_url}")
        except Exception as e:
            logger.error(f"Failed to upload certificate for ID {certificate_id}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to upload certificate: {str(e)}")
    else:
        logger.info(f"No valid file provided for certificate {certificate_id} update.")
    
    # Update other fields only if they have meaningful values
    if should_update(title):
        db_certificate.title = title
    if should_update(issuer):
        db_certificate.issuer = issuer
    if should_update(description):
        db_certificate.description = description
    if is_professional is not None:
        db_certificate.is_professional = is_professional
    if should_update(date_issued_str):
        try:
            db_certificate.date_issued = datetime.strptime(date_issued_str, "%Y-%m-%d").date()
        except ValueError:
            pass
    
    db.commit()
    db.refresh(db_certificate)
    
    return db_certificate


@router.delete("/admin/certificates/{certificate_id}", tags=["Certificates"])
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


#Memorable Moments Management


@router.post("/admin/moments", response_model=schemas.MemorableMomentResponse, tags=["Memorable Moments"])
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


@router.post("/admin/moments/upload", response_model=schemas.MemorableMomentResponse, tags=["Memorable Moments"])
async def upload_moment(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    date_str: Optional[str] = Form(None, alias="date"),
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new memorable moment with image upload."""
    import logging
    logger = logging.getLogger(__name__)
    
    image_url = None
    if file and hasattr(file, 'filename') and file.filename and file.filename.strip():
        try:
            image_url = await FileUploadService.upload_image(file, "moment_")
        except Exception as e:
            logger.error(f"Failed to upload moment image: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    
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


@router.get("/admin/moments", response_model=List[schemas.MemorableMomentResponse], tags=["Memorable Moments"])
def get_moments(db: Session = Depends(get_db)):
    """Get all memorable moments."""
    return db.query(models.MemorableMoment).all()


@router.put("/admin/moments/{moment_id}", response_model=schemas.MemorableMomentResponse, tags=["Memorable Moments"])
async def update_moment(
    moment_id: int,
    file: Union[UploadFile, str, None] = File(None),
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

    def should_update(value):
        """Check if value is meaningful (not None, empty string, or 'string')"""
        if value is None:
            return False
        if isinstance(value, str) and (value == "" or value.lower() == "string"):
            return False
        return True

    # Upload new image if provided
    # Use duck typing instead of isinstance to avoid potential import mismatches
    if file and hasattr(file, 'filename') and file.filename and file.filename.strip():
        try:
            new_image_url = await FileUploadService.upload_image(file, "moment_")
            db_moment.image_url = new_image_url
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

    # Update other fields only if they have meaningful values
    if should_update(title):
        db_moment.title = title
    if should_update(description):
        db_moment.description = description
    if should_update(date_str):
        try:
            db_moment.date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            pass

    db.commit()
    db.refresh(db_moment)
    return db_moment


@router.delete("/admin/moments/{moment_id}", tags=["Memorable Moments"])
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


# Work Experience Management


@router.post("/admin/experience", response_model=schemas.WorkExperienceResponse, tags=["Work Experience"])
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


@router.get("/admin/experience", response_model=List[schemas.WorkExperienceResponse], tags=["Work Experience"])
def get_experience(db: Session = Depends(get_db)):
    """Get all work experience entries."""
    return db.query(models.WorkExperience).all()


@router.put("/admin/experience/{experience_id}", response_model=schemas.WorkExperienceResponse, tags=["Work Experience"])
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
    
    # Helper function to check if value should be updated
    def should_update(value):
        """Check if value is meaningful (not None, empty string, or 'string')"""
        if value is None:
            return False
        if isinstance(value, str) and (value == "" or value.lower() == "string"):
            return False
        return True
    
    # Update only fields with meaningful values
    for key, value in experience.dict(exclude_unset=True).items():
        # For string fields, check if they're meaningful
        if isinstance(value, str):
            if should_update(value):
                setattr(db_experience, key, value)
        else:
            # For non-string fields (dates, booleans), update directly
            setattr(db_experience, key, value)
    
    db.commit()
    db.refresh(db_experience)
    
    return db_experience


@router.delete("/admin/experience/{experience_id}", tags=["Work Experience"])
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


# Project Management


@router.post("/admin/projects", response_model=schemas.ProjectResponse, tags=["Projects"])
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


@router.post("/admin/projects/upload", response_model=schemas.ProjectResponse, tags=["Projects"])
async def upload_project(
    file: UploadFile = File(...),
    title: str = Form(...),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    technologies: Optional[str] = Form(None),
    project_url: Optional[str] = Form(None),
    github_url: Optional[str] = Form(None),
    is_featured: bool = Form(False),
    db: Session = Depends(get_db),
    authenticated: bool = Depends(require_admin)
):
    """Create a new project with image upload."""
    import logging
    logger = logging.getLogger(__name__)
    
    image_url = None
    if file and hasattr(file, 'filename') and file.filename and file.filename.strip():
        try:
            image_url = await FileUploadService.upload_image(file, "project_")
        except Exception as e:
            logger.error(f"Failed to upload project image: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    
    db_project = models.Project(
        title=title,
        category=category,
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


@router.get("/admin/projects", response_model=List[schemas.ProjectResponse], tags=["Projects"])
def get_projects(db: Session = Depends(get_db)):
    """Get all projects."""
    return db.query(models.Project).all()


@router.get("/admin/projects/stats", tags=["Projects"])
def get_project_stats(db: Session = Depends(get_db)):
    """
    Get project statistics by category.
    Returns total count and count per category.
    """
    from sqlalchemy import func
    
    # Get total count
    total = db.query(func.count(models.Project.id)).scalar()
    
    # Get count by category
    category_counts = db.query(
        models.Project.category,
        func.count(models.Project.id).label('count')
    ).group_by(models.Project.category).all()
    
    # Format response
    stats = {
        "total": total,
        "by_category": {}
    }
    
    for category, count in category_counts:
        category_name = category if category else "Uncategorized"
        stats["by_category"][category_name] = count
    
    return stats


@router.get("/admin/projects/category/{category}", response_model=List[schemas.ProjectResponse], tags=["Projects"])
def get_projects_by_category(
    category: str,
    db: Session = Depends(get_db)
):
    """
    Get projects by category.
    
    Categories:
    - AI/ML
    - Web Development
    - Mobile Apps
    - DSA
    - Data Solutions
    - Software Applications
    - All (returns all projects)
    """
    if category.lower() == "all":
        return db.query(models.Project).all()
    
    return db.query(models.Project).filter(
        models.Project.category == category
    ).all()


@router.get("/admin/projects/featured", response_model=List[schemas.ProjectResponse], tags=["Projects"])
def get_featured_projects(db: Session = Depends(get_db)):
    """Get only featured projects."""
    return db.query(models.Project).filter(
        models.Project.is_featured == True
    ).all()


@router.put("/admin/projects/{project_id}", response_model=schemas.ProjectResponse, tags=["Projects"])
async def update_project(
    project_id: int,
    file: Union[UploadFile, str, None] = File(None),
    title: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
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
    
    # Helper function to check if value should be updated
    def should_update(value):
        """Check if value is meaningful (not None, empty string, or 'string')"""
        if value is None:
            return False
        if isinstance(value, str) and (value == "" or value.lower() == "string"):
            return False
        return True
    
    # Upload new image if provided (handle empty string from Swagger)
    # Use duck typing instead of isinstance to avoid potential import mismatches
    if file and hasattr(file, 'filename') and file.filename and file.filename.strip():
        try:
            db_project.image_url = await FileUploadService.upload_image(file, "project_")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    
    # Update other fields only if they have meaningful values
    if should_update(title):
        db_project.title = title
    if should_update(category):
        db_project.category = category
    if should_update(description):
        db_project.description = description
    if should_update(technologies):
        db_project.technologies = technologies
    if should_update(project_url):
        db_project.project_url = project_url
    if should_update(github_url):
        db_project.github_url = github_url
    if is_featured is not None:
        db_project.is_featured = is_featured
    
    db.commit()
    db.refresh(db_project)
    
    return db_project


@router.delete("/admin/projects/{project_id}", tags=["Projects"])
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