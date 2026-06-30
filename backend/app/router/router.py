from app.agents.agent_manager import AGENTS


def get_system_prompt(question: str) -> str:
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
        return AGENTS["resume"]

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
        return AGENTS["roadmap"]

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
        return AGENTS["interview"]

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
        return AGENTS["skillgap"]

    # ==========================
    # Career Mentor (Default)
    # ==========================
    print("🚀 Selected Agent: Career Mentor")
    return AGENTS["career"]