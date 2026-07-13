def choose_agent(question: str) -> str:
    """
    Classify the student's question and return the chosen agent key.

    Allowed keys:
    - career
    - resume
    - roadmap
    - interview
    - skillgap
    """

    question = question.lower().strip()

    # ==========================================
    # Resume Expert
    # Only for explicit resume analysis requests
    # ==========================================
    resume_phrases = [
        "analyze my resume",
        "analyse my resume",
        "review my resume",
        "review my cv",
        "resume analysis",
        "resume scan",
        "ats score",
        "score my resume",
        "upload resume",
        "upload my resume",
        "review resume",
        "scan my resume",
        "check my resume",
        "evaluate my resume",
    ]

    if any(phrase in question for phrase in resume_phrases):
        print("📄 Selected Agent: Resume Expert")
        return "resume"

    # ==========================================
    # Learning Planner
    # ==========================================
    roadmap_keywords = [
        "roadmap",
        "plan",
        "learning path",
        "study plan",
        "learning roadmap",
        "career roadmap",
        "how to learn",
        "how should i start",
    ]

    if any(keyword in question for keyword in roadmap_keywords):
        print("🗺️ Selected Agent: Learning Planner")
        return "roadmap"

    # ==========================================
    # Interview Coach
    # ==========================================
    interview_keywords = [
        "interview",
        "mock interview",
        "technical interview",
        "hr interview",
        "placement",
        "interview questions",
        "prepare for interview",
    ]

    if any(keyword in question for keyword in interview_keywords):
        print("🎤 Selected Agent: Interview Coach")
        return "interview"

    # ==========================================
    # Skill Gap Advisor
    # ==========================================
    skill_keywords = [
        "skill gap",
        "missing skills",
        "skill analysis",
        "analyze my skills",
        "analyse my skills",
        "improve my skills",
        "what skills",
        "skill assessment",
    ]

    if any(keyword in question for keyword in skill_keywords):
        print("📊 Selected Agent: Skill Gap Advisor")
        return "skillgap"

    # ==========================================
    # Career Mentor (Default)
    # ==========================================
    print("🚀 Selected Agent: Career Mentor")
    return "career"