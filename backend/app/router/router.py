def choose_agent(question: str) -> str:
    """
    Classify the student's question and return the chosen agent key.
    Allowed keys: career, resume, roadmap, interview, skillgap
    """
    question = question.lower().strip()

    # ==========================
    # Resume Expert
    # ==========================
    if any(word in question for word in [
        "resume",
        "cv",
        "ats",
        "resume review",
        "improve resume",
        "resume analysis"
    ]):
        print("📄 Selected Agent: Resume Expert")
        return "resume"

    # ==========================
    # Learning Planner
    # ==========================
    if any(word in question for word in [
        "roadmap",
        "plan",
        "learning path",
        "study plan",
        "learning roadmap",
        "career roadmap",
        "how to learn",
        "how should i start"
    ]):
        print("🗺️ Selected Agent: Learning Planner")
        return "roadmap"

    # ==========================
    # Interview Coach
    # ==========================
    if any(word in question for word in [
        "interview",
        "mock interview",
        "technical interview",
        "hr interview",
        "placement",
        "interview questions",
        "prepare for interview"
    ]):
        print("🎤 Selected Agent: Interview Coach")
        return "interview"

    # ==========================
    # Skills Advisor
    # ==========================
    if any(word in question for word in [
        "skill gap",
        "skills",
        "missing skills",
        "skill analysis",
        "analyze my skills",
        "improve my skills",
        "what skills"
    ]):
        print("📊 Selected Agent: Skills Advisor")
        return "skillgap"

    # ==========================
    # Career Mentor (Default)
    # ==========================
    print("🚀 Selected Agent: Career Mentor")
    return "career"