"""
CareerPilot AI
Resume Scoring Engine
Version: 2.0
"""

from app.resume.constants import (
    TECHNICAL_SKILLS,
    RESUME_SECTIONS,
    SKILL_POINTS,
    SECTION_POINTS,
    PROJECT_POINTS,
    INTERNSHIP_POINTS,
    CERTIFICATE_POINTS,
    GITHUB_POINTS,
    LINKEDIN_POINTS,
    MAX_SCORE,
)

from app.resume.skill_extractor import extract_skills


def calculate_resume_score(resume_text: str):
    """
    Calculate Resume Score, ATS Score,
    strengths, weaknesses and missing skills.
    """

    text = resume_text.lower()

    score = 0

    strengths = []
    weaknesses = []

    # -----------------------------
    # Skill Detection
    # -----------------------------

    skills = extract_skills(resume_text)

    technical_skills = skills["technical_skills"]

    score += len(technical_skills) * SKILL_POINTS

    if len(technical_skills) >= 8:
        strengths.append("Excellent technical skill coverage.")
    elif len(technical_skills) >= 5:
        strengths.append("Good technical skills.")
    else:
        weaknesses.append("Add more technical skills.")

    # -----------------------------
    # Resume Sections
    # -----------------------------

    for section in RESUME_SECTIONS:
        if section.lower() in text:
            score += SECTION_POINTS
        else:
            weaknesses.append(f"Missing section: {section.title()}")

    # -----------------------------
    # Projects
    # -----------------------------

    if "project" in text:
        score += PROJECT_POINTS
        strengths.append("Projects included.")
    else:
        weaknesses.append("Projects section missing.")

    # -----------------------------
    # Internship
    # -----------------------------

    if "internship" in text:
        score += INTERNSHIP_POINTS
        strengths.append("Internship experience added.")
    else:
        weaknesses.append("No internship mentioned.")

    # -----------------------------
    # Certifications
    # -----------------------------

    if "certificate" in text or "certification" in text:
        score += CERTIFICATE_POINTS
        strengths.append("Certifications included.")
    else:
        weaknesses.append("Add certifications.")

    # -----------------------------
    # GitHub
    # -----------------------------

    if "github.com" in text:
        score += GITHUB_POINTS
        strengths.append("GitHub profile available.")
    else:
        weaknesses.append("Add GitHub profile.")

    # -----------------------------
    # LinkedIn
    # -----------------------------

    if "linkedin.com" in text:
        score += LINKEDIN_POINTS
        strengths.append("LinkedIn profile available.")
    else:
        weaknesses.append("Add LinkedIn profile.")

    # -----------------------------
    # ATS Score
    # -----------------------------

    ats_score = min(100, int((score / MAX_SCORE) * 100))

    score = min(score, MAX_SCORE)

    # -----------------------------
    # Missing Skills
    # -----------------------------

    technical_lower = [s.lower() for s in technical_skills]

    missing_skills = []

    for skill in TECHNICAL_SKILLS:
        if skill.lower() not in technical_lower:
            missing_skills.append(skill.title())

    return {
        "resume_score": score,
        "ats_score": ats_score,
        "technical_skills": technical_skills,
        "soft_skills": skills["soft_skills"],
        "strengths": strengths,
        "weaknesses": weaknesses,
        "missing_skills": missing_skills[:15],
    }