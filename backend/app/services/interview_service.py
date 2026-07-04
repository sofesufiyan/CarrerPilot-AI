import json
import logging
from typing import Dict, Any, List

from app.tools.gemini_tool import ask_gemini_json

logger = logging.getLogger("uvicorn.error")

def _force_json_response(prompt: str) -> str:
    """Helper to ensure prompt asks for strict JSON."""
    return prompt + "\n\nIMPORTANT: Return ONLY a valid JSON object. Do NOT wrap in markdown block. Do NOT add any extra text."

def start_interview(role: str, difficulty: str, interview_type: str) -> str:
    """Generates the first question for the interview."""
    prompt = f"""
    You are an expert technical and behavioral interviewer for a {role} position.
    The difficulty level is {difficulty}. The interview type is {interview_type}.
    
    Start the interview by asking the very first interview question. 
    Make it realistic, challenging but fair for the {difficulty} level.
    
    Return ONLY a JSON object with this exact structure:
    {{
        "question": "The question text"
    }}
    """
    
    try:
        data = ask_gemini_json(_force_json_response(prompt))
        return data.get("question", "Could you tell me about yourself and your background?")
    except Exception as e:
        logger.error(f"Error starting interview: {e}")
        return "Can you tell me about a time you solved a complex problem in a project?"

def evaluate_answer(role: str, difficulty: str, interview_type: str, question: str, user_answer: str, current_question_index: int, total_questions: int) -> Dict[str, Any]:
    """Evaluates an answer and asks the next question, or signals completion."""
    is_last = current_question_index >= total_questions - 1
    
    next_question_instruction = "Since this is the last question, set next_question to null and is_complete to true." if is_last else f"Ask the next question (Question {current_question_index + 2} of {total_questions}) for this {interview_type} interview. Make it related or a completely new topic. Set is_complete to false."
    
    prompt = f"""
    You are an expert {role} interviewer. 
    Difficulty: {difficulty}. Type: {interview_type}.
    
    I asked the candidate this question: "{question}"
    The candidate answered: "{user_answer}"
    
    Evaluate this answer. 
    1. Provide 1-2 sentences of strengths.
    2. Provide 1-2 sentences of areas to improve.
    3. Give a score out of 10.
    4. {next_question_instruction}
    
    Return ONLY a JSON object with this exact structure:
    {{
        "feedback_strengths": "Strengths here",
        "feedback_improvements": "Improvements here",
        "score": 8,
        "next_question": "The next question text (or null if complete)",
        "is_complete": false
    }}
    """
    
    data = ask_gemini_json(_force_json_response(prompt))
    return data

def generate_report(role: str, history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Generates a final report summarizing the entire interview."""
    history_text = ""
    total_score = 0
    for i, item in enumerate(history):
        q = item.get('question', '')
        a = item.get('answer', '')
        s = item.get('score', 0)
        total_score += s
        history_text += f"\nQ{i+1}: {q}\nA{i+1}: {a}\nScore: {s}/10\n"
        
    avg_score = round(total_score / max(1, len(history)), 1)
    
    prompt = f"""
    You are an expert {role} career coach.
    Review this interview transcript and generate a final performance report.
    
    Transcript:
    {history_text}
    
    Return ONLY a JSON object with this exact structure:
    {{
        "overall_feedback": "A paragraph summarizing their overall performance.",
        "top_strengths": ["strength 1", "strength 2"],
        "key_weaknesses": ["weakness 1", "weakness 2"],
        "improvement_plan": ["step 1", "step 2", "step 3"]
    }}
    """
    
    data = ask_gemini_json(_force_json_response(prompt))
    
    return {
        "average_score": avg_score,
        "overall_feedback": data.get("overall_feedback", "Good effort."),
        "top_strengths": data.get("top_strengths", []),
        "key_weaknesses": data.get("key_weaknesses", []),
        "improvement_plan": data.get("improvement_plan", [])
    }
