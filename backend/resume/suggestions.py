"""
CareerPilot AI
Resume Suggestions Engine
Version: 2.0
"""


def generate_suggestions(result: dict):
    """
    Generate improvement suggestions based on
    resume analysis.
    """

    suggestions = []

    weaknesses = result.get("weaknesses", [])

    for weakness in weaknesses:

        if "technical skills" in weakness.lower():
            suggestions.append(
                "Learn Python, SQL, Git, FastAPI, Docker and Machine Learning."
            )

        elif "projects" in weakness.lower():
            suggestions.append(
                "Build at least 3 real-world projects and upload them to GitHub."
            )

        elif "internship" in weakness.lower():
            suggestions.append(
                "Complete one internship or virtual internship."
            )

        elif "github" in weakness.lower():
            suggestions.append(
                "Create a GitHub profile and upload your projects."
            )

        elif "linkedin" in weakness.lower():
            suggestions.append(
                "Create a professional LinkedIn profile."
            )

        elif "certification" in weakness.lower():
            suggestions.append(
                "Complete free certifications from Google, Microsoft or Kaggle."
            )

        elif "summary" in weakness.lower():
            suggestions.append(
                "Write a professional resume summary."
            )

        else:
            suggestions.append(
                f"Improve: {weakness}"
            )

    # Remove duplicates
    suggestions = list(dict.fromkeys(suggestions))

    return suggestions