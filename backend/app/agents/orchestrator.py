from app.router.router import get_system_prompt
from app.tools.agent_logger import add


def prepare_prompt(question: str):
    add("🧠 Orchestrator Started")

    system_prompt = get_system_prompt(question)

    add("🤖 Agent Prompt Prepared")

    return f"""
{system_prompt}

Student Question:

{question}
"""