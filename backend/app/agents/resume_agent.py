"""
CareerPilot AI
Resume Agent

Responsible for:
- Resume Analysis
- Resume Score
- ATS Score
- Skill Extraction
- Suggestions
- AI Explanation

Version: 2.0
"""

from app.agents.base_agent import BaseAgent
from app.resume.scoring_engine import calculate_resume_score
from app.resume.suggestions import generate_suggestions
from app.router.router import get_system_prompt


class ResumeAgent(BaseAgent):
    """
    Professional Resume Agent.
    """

    def __init__(self):
        super().__init__("Resume Agent")

    def analyze(self, resume_text: str):
        """
        Analyze the resume using the local Resume Engine.
        """

        self.log("Starting Resume Analysis")

        result = calculate_resume_score(resume_text)

        suggestions = generate_suggestions(result)

        result["suggestions"] = suggestions

        self.log("Resume Engine Completed")

        return result

    def build_prompt(self, resume_text: str):
        """
        Create the prompt sent to Gemini.
        """

        analysis = self.analyze(resume_text)

        system_prompt = get_system_prompt("review my resume")

        prompt = f"""
{system_prompt}

Student Resume

{resume_text}

━━━━━━━━━━━━━━━━━━

Resume Analysis

Resume Score:
{analysis["resume_score"]}/100

ATS Score:
{analysis["ats_score"]}/100

Technical Skills:
{", ".join(analysis["technical_skills"])}

Soft Skills:
{", ".join(analysis["soft_skills"])}

Strengths:
{chr(10).join("- " + s for s in analysis["strengths"])}

Weaknesses:
{chr(10).join("- " + s for s in analysis["weaknesses"])}

Missing Skills:
{", ".join(analysis["missing_skills"])}

Suggestions:
{chr(10).join("- " + s for s in analysis["suggestions"])}

━━━━━━━━━━━━━━━━━━

IMPORTANT

Do NOT invent scores.

Use ONLY the Resume Analysis above.

Explain:

• Resume quality
• ATS readiness
• Biggest strengths
• Biggest weaknesses
• Most important improvements

Keep the answer under 350 words.
"""

        return prompt, analysis