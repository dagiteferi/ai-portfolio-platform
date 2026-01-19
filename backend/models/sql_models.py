from sqlalchemy import Column, Integer, String, Text, Date, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base

class CV(Base):
    __tablename__ = "cvs"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class TechnicalSkill(Base):
    __tablename__ = "technical_skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True) # e.g., Frontend, Backend, DevOps
    proficiency = Column(String, nullable=True) # e.g., Expert, Intermediate
    icon = Column(String, nullable=True)

class Education(Base):
    __tablename__ = "education"

    id = Column(Integer, primary_key=True, index=True)
    degree = Column(String, nullable=False)
    institution = Column(String, nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    description = Column(Text, nullable=True)
    gpa = Column(String, nullable=True)
    highlights = Column(Text, nullable=True) # Stored as JSON string or delimiter-separated
    courses = Column(Text, nullable=True) # Stored as JSON string or delimiter-separated

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    issuer = Column(String, nullable=False)
    date_issued = Column(Date, nullable=True)
    url = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    is_professional = Column(Boolean, default=False) # To distinguish professional certificates

class MemorableMoment(Base):
    __tablename__ = "memorable_moments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    date = Column(Date, nullable=True)
    image_url = Column(String, nullable=True)

class WorkExperience(Base):
    __tablename__ = "work_experience"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True) # Null for present
    is_current = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    achievements = Column(Text, nullable=True) # Stored as JSON string or delimiter-separated
    technologies = Column(Text, nullable=True) # Stored as JSON string or delimiter-separated

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)  # AI/ML, Web Development, Mobile Apps, DSA, Data Solutions, Software Applications
    technologies = Column(String, nullable=True) # Comma-separated or JSON string
    project_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    is_featured = Column(Boolean, default=False)
