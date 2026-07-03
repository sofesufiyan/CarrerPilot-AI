"""
CareerPilot AI
Resume Agent

Responsible for:
- Resume Analysis
- Resume Score
- ATS Score
- Skill Extraction
- Suggestions
- Structured AI Roadmap & Recommendations Generation (Version 1.0)

Version: 3.1
"""

from app.agents.base_agent import BaseAgent
from app.resume.scoring_engine import calculate_resume_score
from app.resume.suggestions import generate_suggestions

RESUME_SYSTEM_PROMPT = """You are CareerPilot Resume Agent.

Your job is to analyze the student's resume and generate a structured JSON response containing:
- An analysis of their resume quality, ATS readiness, strengths, weaknesses, and key improvements.
- A personalized learning roadmap to bridge their missing skill gaps (limited to exactly 6 clear, sequential, actionable steps).
- Recommended job roles as structured objects.
- Recommended industry certifications as structured objects.
- Useful learning resources as structured objects.
- Recommended projects as structured objects to build their portfolio.
- An overall confidence score (0 to 100) representing your confidence in this analysis matching their profile.

You must return a single valid JSON object matching the requested schema. Do not write any explanations or conversational text outside the JSON object.
"""

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
        Create the prompt sent to Gemini requesting structured JSON.
        """
        analysis = self.analyze(resume_text)
        system_prompt = RESUME_SYSTEM_PROMPT

        prompt = f"""
{system_prompt}

Student Resume Content:
{resume_text}

━━━━━━━━━━━━━━━━━━

Local Scoring Engine Metrics:
- Resume Score: {analysis["resume_score"]}/100
- ATS Score: {analysis["ats_score"]}/100
- Technical Skills: {", ".join(analysis["technical_skills"])}
- Soft Skills: {", ".join(analysis["soft_skills"])}
- Strengths: {", ".join(analysis["strengths"])}
- Weaknesses: {", ".join(analysis["weaknesses"])}
- Missing Skills: {", ".join(analysis["missing_skills"])}
- Suggestions: {", ".join(analysis["suggestions"])}

━━━━━━━━━━━━━━━━━━

INSTRUCTIONS:
Generate a structured JSON response with the following keys. Ensure values are detailed, actionable, and specific to the student's profile:
{{
  "ai_explanation": "A professional summary of the resume quality, ATS readiness, strengths, weaknesses, and key improvements. (Keep under 300 words).",
  "confidence_score": 90,
  "roadmap": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ...",
    "Step 4: ...",
    "Step 5: ...",
    "Step 6: ..."
  ],
  "recommended_roles": [
    {{
      "title": "Job Title (e.g. Junior ML Engineer)",
      "salary_range": "Average salary (e.g. $85,000 - $110,000)",
      "match_percentage": 85
    }}
  ],
  "recommended_certifications": [
    {{
      "name": "Certification Name (e.g. AWS Certified Machine Learning - Specialty)",
      "provider": "Provider Name (e.g. Amazon Web Services)",
      "difficulty": "Beginner/Intermediate/Advanced"
    }}
  ],
  "learning_resources": [
    {{
      "title": "Resource Name (e.g. Google Machine Learning Crash Course)",
      "url": "Recommended URL (or 'https://google.com' if generic)",
      "type": "Course/Documentation/Tutorial/Book"
    }}
  ],
  "recommended_projects": [
    {{
      "title": "Project Name (e.g. End-to-End MLOps Pipeline)",
      "description": "Short description of what to build and how it helps their profile.",
      "tech_stack": ["Python", "Docker", "GitHub Actions", "FastAPI"]
    }}
  ]
}}

Ensure there are exactly 6 steps in the "roadmap" array.
Do not invent score metrics (use the local scores for resume_score/ats_score).
Output ONLY the raw JSON object. Do not include markdown code fence formatting (such as ```json) or other text around the JSON.
"""
        return prompt, analysis