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