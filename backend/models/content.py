from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid

class EducationEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str # "degree" or "certificate"
    title: str
    institution: str
    year: str
    gpa: Optional[str] = None
    description: Optional[str] = None # For certificate details or course description

class ExperienceEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    company: str
    start_date: str
    end_date: Optional[str] = None # Can be "present" or null
    location: Optional[str] = None
    responsibilities: List[str] = []

class Skill(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: Optional[str] = None # e.g., "Programming Languages", "Frameworks", "AI/ML"

class Service(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    icon: Optional[str] = None # e.g., Lucide icon name or path to an image

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    url: str
    description: str
    is_featured: bool = False
    image_url: Optional[str] = None # URL to project thumbnail/image
    technologies: List[str] = []

class MemorableMoment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    date: str # YYYY-MM-DD format
    image_url: str

class Profile(BaseModel):
    name: str
    bio: str
    location: str
    email: str
    phone: str
    linkedin: str
    github_url: Optional[str] = None
    cv_url: Optional[str] = None # URL to the CV file
    about_photo_url: Optional[str] = None # URL to the photo for the about page
    education: List[EducationEntry] = []
    experience: List[ExperienceEntry] = []
    skills: List[Skill] = []
    languages: List[str] = []
    awards: List[str] = []
    services: List[Service] = []

class GithubKnowledgeBase(BaseModel):
    profile: Profile
    projects: List[Project] = []

class PersonalKnowledgeBase(BaseModel):
    interests: Dict[str, Any] # Keeping this flexible for now
    memorable_moments: List[MemorableMoment] = []
