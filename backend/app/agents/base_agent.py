"""
CareerPilot AI
Base Agent

Every AI agent inherits from this class.

Author: Mohammed Sufiyan
Version: 2.0
"""

from app.tools.agent_logger import add
from app.tools.gemini_tool import ask_gemini_json


class BaseAgent:
    """
    Base class for all AI agents.
    """

    def __init__(self, agent_name: str):
        self.agent_name = agent_name

    def log(self, message: str):
        """
        Add agent log.
        """
        add(f"[{self.agent_name}] {message}")

    def ask_llm(self, prompt: str):
        """
        Send prompt to Gemini.
        """

        self.log("Sending request to Gemini...")

        response = ask_gemini_json(prompt)

        self.log("Received response from Gemini.")

        return response