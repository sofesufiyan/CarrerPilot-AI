from app.agents.career_agent import CAREER_SYSTEM_PROMPT
from app.agents.resume_agent import RESUME_SYSTEM_PROMPT
from app.agents.roadmap_agent import ROADMAP_SYSTEM_PROMPT
from app.agents.interview_agent import INTERVIEW_SYSTEM_PROMPT
from app.agents.skillgap_agent import SKILLGAP_SYSTEM_PROMPT

AGENTS = {
    "career": CAREER_SYSTEM_PROMPT,
    "resume": RESUME_SYSTEM_PROMPT,
    "roadmap": ROADMAP_SYSTEM_PROMPT,
    "interview": INTERVIEW_SYSTEM_PROMPT,
    "skillgap": SKILLGAP_SYSTEM_PROMPT,
}


def get_agent_prompt(agent_name: str) -> str:
    """
    Retrieve the registered system prompt using the agent key.
    Defaults to CAREER_SYSTEM_PROMPT if the key is not found.
    """
    return AGENTS.get(agent_name, CAREER_SYSTEM_PROMPT)