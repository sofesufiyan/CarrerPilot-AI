from app.agents.agent_manager import AGENTS


def get_system_prompt(question: str) -> str:
    question = question.lower()

    if "resume" in question or "cv" in question:
        print("Selected Agent: Resume")
        return AGENTS["resume"]

    print("Selected Agent: Career")
    return AGENTS["career"]