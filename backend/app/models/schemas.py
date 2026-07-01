from pydantic import BaseModel


class CareerRequest(BaseModel):
    question: str


class CareerResponse(BaseModel):
    answer: str


class ResumeResponse(BaseModel):
    filename: str
    resume_score: int
    ats_score: int
    technical_skills: list[str]
    soft_skills: list[str]
    strengths: list[str]
    weaknesses: list[str]
    missing_skills: list[str]
    suggestions: list[str]
    ai_explanation: str