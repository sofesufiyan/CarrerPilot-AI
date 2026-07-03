from pydantic import BaseModel, Field
from typing import List, Optional

class CareerRequest(BaseModel):
    question: str

class CareerResponse(BaseModel):
    answer: str

# Structured sub-schemas for Resume Intelligence Engine v1.0
class JobRoleItem(BaseModel):
    title: str
    salary_range: str
    match_percentage: int

class CertificationItem(BaseModel):
    name: str
    provider: str
    difficulty: str

class ResourceItem(BaseModel):
    title: str
    url: str
    type: str

class ProjectItem(BaseModel):
    title: str
    description: str
    tech_stack: List[str]

class ResumeResponse(BaseModel):
    id: Optional[str] = None
    filename: str
    resume_score: int
    ats_score: int
    technical_skills: List[str] = Field(default_factory=list)
    soft_skills: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    ai_explanation: str
    
    # Extended intelligence engine parameters (Version 1.0)
    confidence_score: Optional[int] = None
    generated_at: Optional[str] = None
    schema_version: str = "1.0"
    roadmap: List[str] = Field(default_factory=list)
    
    # Structured objects (fully backward compatible)
    recommended_roles: List[JobRoleItem] = Field(default_factory=list)
    recommended_certifications: List[CertificationItem] = Field(default_factory=list)
    learning_resources: List[ResourceItem] = Field(default_factory=list)
    recommended_projects: List[ProjectItem] = Field(default_factory=list)