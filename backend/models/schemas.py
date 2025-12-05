from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime

# Shared properties
class CVBase(BaseModel):
    url: str

class CVCreate(CVBase):
    pass

class CVUpdate(CVBase):
    pass

class CVResponse(CVBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TechnicalSkillBase(BaseModel):
    name: str
    category: Optional[str] = None
    proficiency: Optional[str] = None
    icon: Optional[str] = None

class TechnicalSkillCreate(TechnicalSkillBase):
    pass

class TechnicalSkillUpdate(TechnicalSkillBase):
    pass

class TechnicalSkillResponse(TechnicalSkillBase):
    id: int

    class Config:
        from_attributes = True

class EducationBase(BaseModel):
    degree: str
    institution: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class EducationUpdate(EducationBase):
    pass

class EducationResponse(EducationBase):
    id: int

    class Config:
        from_attributes = True

class CertificateBase(BaseModel):
    title: str
    issuer: str
    date_issued: Optional[date] = None
    url: Optional[str] = None
    description: Optional[str] = None
    is_professional: bool = False

class CertificateCreate(CertificateBase):
    pass

class CertificateUpdate(CertificateBase):
    pass

class CertificateResponse(CertificateBase):
    id: int

    class Config:
        from_attributes = True

class MemorableMomentBase(BaseModel):
    title: str
    description: Optional[str] = None
    date: Optional[date] = None
    image_url: Optional[str] = None

class MemorableMomentCreate(MemorableMomentBase):
    pass

class MemorableMomentUpdate(MemorableMomentBase):
    pass

class MemorableMomentResponse(MemorableMomentBase):
    id: int

    class Config:
        from_attributes = True

class WorkExperienceBase(BaseModel):
    title: str
    company: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: bool = False
    description: Optional[str] = None
    location: Optional[str] = None

class WorkExperienceCreate(WorkExperienceBase):
    pass

class WorkExperienceUpdate(WorkExperienceBase):
    pass

class WorkExperienceResponse(WorkExperienceBase):
    id: int

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    technologies: Optional[str] = None
    project_url: Optional[str] = None
    github_url: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = False

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True
