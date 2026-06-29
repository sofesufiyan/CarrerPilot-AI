from app.agents.agent_manager import AGENTS


def get_system_prompt(question: str) -> str:
    question = question.lower()

    # Resume Agent
    if any(word in question for word in [
        "resume",
        "cv",
        "ats"
    ]):
        print("Selected Agent: Resume")
        return AGENTS["resume"]

    # Roadmap Agent
    if any(word in question for word in [
        "roadmap",
        "plan",
        "learning path",
        "study plan"
    ]):
        print("Selected Agent: Roadmap")
        return AGENTS["roadmap"]
        # Interview Agent
    if any(word in question for word in [
        "interview",
        "mock interview",
        "hr interview",
        "technical interview",
        "interview questions"
    ]):
        print("Selected Agent: Interview")
        return AGENTS["interview"]
        # Skill Gap Agent
    if any(word in question for word in [
        "skill gap",
        "skills",
        "missing skills",
        "analyze my skills",
        "skill analysis"
    ]):
        print("Selected Agent: Skill Gap")
        return AGENTS["skillgap"]

    # Default
    print("Selected Agent: Career")
    return AGENTS["career"]