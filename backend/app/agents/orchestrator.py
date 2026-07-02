from app.router.router import choose_agent
from app.agents.agent_manager import get_agent_prompt
from app.tools.agent_logger import add


def prepare_prompt(question: str) -> str:
    """
    Coordinate prompt preparation:
    1. Choose the agent key based on the question.
    2. Retrieve the matching system prompt.
    3. Combine system prompt with the user's question.
    """
    add("🧠 Orchestrator Started")

    agent_key = choose_agent(question)
    system_prompt = get_agent_prompt(agent_key)

    add("🤖 Agent Prompt Prepared")

    return f"""
{system_prompt}

Student Question:

{question}
"""