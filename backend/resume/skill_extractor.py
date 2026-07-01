"""
CareerPilot AI
Resume Skill Extractor
Version: 2.0
"""

from app.resume.constants import TECHNICAL_SKILLS, SOFT_SKILLS


def extract_skills(resume_text: str):
    """
    Extract technical and soft skills from resume text.
    """

    text = resume_text.lower()

    technical_found = []
    soft_found = []

    # -----------------------------
    # Technical Skills
    # -----------------------------
    for skill in TECHNICAL_SKILLS:
        if skill.lower() in text:
            technical_found.append(skill.title())

    # -----------------------------
    # Soft Skills
    # -----------------------------
    for skill in SOFT_SKILLS:
        if skill.lower() in text:
            soft_found.append(skill.title())

    # Remove duplicates

    technical_found = sorted(list(set(technical_found)))
    soft_found = sorted(list(set(soft_found)))

    return {
        "technical_skills": technical_found,
        "soft_skills": soft_found,
        "total_skills": len(technical_found) + len(soft_found),
    }