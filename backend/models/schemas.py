from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import date as Date, datetime

#CV Schemas

class CVBase(BaseModel):
    url: str

class CVCreate(CVBase):
    pass

class CVUpdate(BaseModel):
    """All fields optional for partial updates"""
    url: Optional[str] = None

class CVResponse(CVBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


#Technical Skill Schemas
class TechnicalSkillBase(BaseModel):
    name: str
    proficiency: str
    category: Optional[str] = None
    icon: Optional[str] = None

class TechnicalSkillCreate(TechnicalSkillBase):
    @field_validator('category', 'icon', mode='before')
    @classmethod
    def clean_optional_fields(cls, v):
        """Convert placeholder or empty strings to None"""
        if v is None:
            return None
        if isinstance(v, str):
            v = v.strip()
            # Convert common placeholder values to None
            if v == "" or v.lower() in ["string", "null", "none"]:
                return None
        return v

class TechnicalSkillUpdate(BaseModel):
    """All fields optional for partial updates"""
    name: Optional[str] = None
    category: Optional[str] = None
    proficiency: Optional[str] = None
    icon: Optional[str] = None
    
    @field_validator('name', 'category', 'proficiency', 'icon', mode='before')
    @classmethod
    def clean_optional_fields(cls, v):
        """Convert placeholder or empty strings to None"""
        if v is None:
            return None
        if isinstance(v, str):
            v = v.strip()
            # Convert common placeholder values to None
            if v == "" or v.lower() in ["string", "null", "none"]:
                return None
        return v

class TechnicalSkillResponse(TechnicalSkillBase):
    id: int

    class Config:
        from_attributes = True


# Education Schemas

class EducationBase(BaseModel):
    degree: str
    institution: str
    start_date: Optional[Date] = None
    end_date: Optional[Date] = None
    description: Optional[str] = None
    gpa: Optional[str] = None
    highlights: Optional[str] = None
    courses: Optional[str] = None

    @field_validator('start_date', 'end_date', mode='before')
    @classmethod
    def empty_date_to_none(cls, v):
        if v is None:
            return None
        if isinstance(v, str) and v.strip() == '':
            return None
        return v

class EducationCreate(EducationBase):
    pass

class EducationUpdate(BaseModel):
    """All fields optional for partial updates"""
    degree: Optional[str] = None
    institution: Optional[str] = None
    start_date: Optional[Date] = None
    end_date: Optional[Date] = None
    description: Optional[str] = None
    gpa: Optional[str] = None
    highlights: Optional[str] = None
    courses: Optional[str] = None

    @field_validator('start_date', 'end_date', mode='before')
    @classmethod
    def empty_date_to_none(cls, v):
        if v is None:
            return None
        if isinstance(v, str) and v.strip() == '':
            return None
        return v
class EducationResponse(EducationBase):
    id: int

    class Config:
        from_attributes = True


#Certificate Schemas

class CertificateBase(BaseModel):
    title: str
    issuer: str
    date_issued: Optional[Date] = None
    url: Optional[str] = None
    description: Optional[str] = None
    is_professional: bool = False

class CertificateCreate(CertificateBase):
    pass

class CertificateUpdate(BaseModel):
    """All fields optional for partial updates"""
    title: Optional[str] = None
    issuer: Optional[str] = None
    date_issued: Optional[Date] = None
    url: Optional[str] = None
    description: Optional[str] = None
    is_professional: Optional[bool] = None

class CertificateResponse(CertificateBase):
    id: int

    class Config:
        from_attributes = True


# Memorable Moment Schemas

class MemorableMomentBase(BaseModel):
    title: str
    description: Optional[str] = None
    # Avoid `date: Optional[date]` — field name shadows datetime.date and breaks validation.
    date: Optional[Date] = None
    image_url: Optional[str] = None

class MemorableMomentCreate(MemorableMomentBase):
    pass

class MemorableMomentUpdate(BaseModel):
    """All fields optional for partial updates"""
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[Date] = None
    image_url: Optional[str] = None

class MemorableMomentResponse(MemorableMomentBase):
    id: int

    class Config:
        from_attributes = True


# Work Experience Schemas

class WorkExperienceBase(BaseModel):
    title: str
    company: str
    type: Optional[str] = None
    start_date: Optional[Date] = None
    end_date: Optional[Date] = None
    is_current: bool = False
    description: Optional[str] = None
    location: Optional[str] = None
    achievements: Optional[str] = None
    technologies: Optional[str] = None

    @field_validator('start_date', 'end_date', mode='before')
    @classmethod
    def empty_date_to_none(cls, v):
        if v is None:
            return None
        if isinstance(v, str) and v.strip() == '':
            return None
        return v

class WorkExperienceCreate(WorkExperienceBase):
    pass

class WorkExperienceUpdate(BaseModel):
    """All fields optional for partial updates"""
    title: Optional[str] = None
    company: Optional[str] = None
    type: Optional[str] = None
    start_date: Optional[Date] = None
    end_date: Optional[Date] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    location: Optional[str] = None
    achievements: Optional[str] = None
    technologies: Optional[str] = None

    @field_validator('start_date', 'end_date', mode='before')
    @classmethod
    def empty_date_to_none(cls, v):
        if v is None:
            return None
        if isinstance(v, str) and v.strip() == '':
            return None
        return v

class WorkExperienceResponse(WorkExperienceBase):
    id: int

    class Config:
        from_attributes = True


# Project Schemas

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    technologies: Optional[str] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = False

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    """All fields optional for partial updates"""
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    technologies: Optional[str] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True
