import json
import logging
import threading
from typing import Dict, Any, List

from app.tools.gemini_tool import ask_gemini_json

logger = logging.getLogger("uvicorn.error")

# Thread-safe global cache for asked questions to avoid duplication
_lock = threading.Lock()
# Maps (role, difficulty, interview_type) to a List[str] of asked questions
_asked_questions_cache = {}

def _register_asked_question(role: str, difficulty: str, interview_type: str, question: str):
    key = (role.strip().lower(), difficulty.strip().lower(), interview_type.strip().lower())
    with _lock:
        if key not in _asked_questions_cache:
            _asked_questions_cache[key] = []
        if question not in _asked_questions_cache[key]:
            _asked_questions_cache[key].append(question)
            # Limit cache size per key to prevent infinite memory growth
            if len(_asked_questions_cache[key]) > 100:
                _asked_questions_cache[key].pop(0)

def _get_asked_questions_list(role: str, difficulty: str, interview_type: str) -> List[str]:
    key = (role.strip().lower(), difficulty.strip().lower(), interview_type.strip().lower())
    with _lock:
        return list(_asked_questions_cache.get(key, []))

def _clear_asked_questions(role: str, difficulty: str, interview_type: str):
    key = (role.strip().lower(), difficulty.strip().lower(), interview_type.strip().lower())
    with _lock:
        _asked_questions_cache[key] = []

def start_interview(role: str, difficulty: str, interview_type: str) -> str:
    """Generates the first question for the interview."""
    # Reset local asked questions cache for this specific role/difficulty/type session
    _clear_asked_questions(role, difficulty, interview_type)
    
    prompt = f"""
    You are an expert interviewer conducting a {interview_type} interview for a {role} position.
    The candidate has selected the difficulty level: {difficulty}.
    
    Please generate the first question of the interview.
    
    Requirements:
    1. The question must be highly specific to the role of a {role} at a {difficulty} level. Avoid generic introductory questions (like "Tell me about yourself") unless specifically tailored to their domain.
    2. Since this is the start of the interview (difficulty level: {difficulty}), ask a fundamental or introductory question appropriate for this difficulty level.
    3. The question type is {interview_type}.
       - If 'Technical', ask a technical, conceptual, or problem-solving question specific to {role}.
       - If 'HR / Behavioral', ask a situational or behavioral question relevant to a {role} professional.
       - If 'Mixed', ask a question blending both technical and behavioral aspects.
    
    Return ONLY a JSON object with this exact structure:
    {{
        "question": "The question text"
    }}
    """
    
    try:
        data = ask_gemini_json(prompt)
        question = data.get("question", "Could you tell me about yourself and your background?")
        _register_asked_question(role, difficulty, interview_type, question)
        return question
    except Exception as e:
        logger.error(f"Error starting interview: {e}")
        fallback = f"Can you describe your experience working as a {role} and walk me through a major project you led?"
        _register_asked_question(role, difficulty, interview_type, fallback)
        return fallback

def evaluate_answer(
    role: str,
    difficulty: str,
    interview_type: str,
    question: str,
    user_answer: str,
    current_question_index: int,
    total_questions: int
) -> Dict[str, Any]:
    """Evaluates an answer and asks the next question, or signals completion."""
    # Ensure current question is registered in our cache
    _register_asked_question(role, difficulty, interview_type, question)
    
    # Retrieve all questions asked so far in this session to avoid duplicates
    asked_questions = _get_asked_questions_list(role, difficulty, interview_type)
    
    is_last = current_question_index >= total_questions - 1
    
    # Determine the difficulty progression instructions
    progress_percentage = (current_question_index + 1) / total_questions
    if progress_percentage < 0.4:
        difficulty_instruction = f"Ask an introductory or foundational question appropriate for a {difficulty} level {role}."
    elif progress_percentage < 0.8:
        difficulty_instruction = f"Ask an intermediate or scenario-based question that builds on the role, slightly more challenging than previous questions."
    else:
        difficulty_instruction = f"Ask an advanced, deep-dive technical challenge or complex behavioral conflict question suitable for a top-tier {role}."
        
    next_question_instruction = (
        "Since this was the last question, set next_question to null and is_complete to true."
        if is_last else
        f"Ask the next question (Question {current_question_index + 2} of {total_questions}). "
        f"Ensure it is highly specific to the {role} position under the {interview_type} interview type. "
        f"Do NOT ask any of the previously asked questions listed below. "
        f"{difficulty_instruction} Set is_complete to false."
    )
    
    asked_questions_str = "\n".join([f"- {q}" for q in asked_questions])
    
    prompt = f"""
    You are an expert interviewer conducting a {interview_type} interview for a {role} position.
    Selected Difficulty: {difficulty}.
    
    The candidate has just answered Question {current_question_index + 1} of {total_questions}.
    
    Question Asked: "{question}"
    Candidate's Answer: "{user_answer}"
    
    Evaluate the candidate's answer based on the following criteria:
    1. Technical Knowledge (depth, correctness, and domain alignment for a {role})
    2. Communication (articulation, structure, clarity)
    3. Problem Solving (reasoning, structured approach, critical thinking)
    
    Instructions:
    1. Compile the positive feedback under 'feedback_strengths' (1-2 clear sentences).
    2. Compile the constructive feedback and areas to improve under 'feedback_improvements' (1-2 clear sentences).
    3. Assign an integer score out of 10 (where 10 is perfect and 1 is completely incorrect/blank).
    4. {next_question_instruction}
    
    List of previously asked questions (Do NOT repeat or ask duplicates of these):
    {asked_questions_str}
    
    Return ONLY a JSON object with this exact structure:
    {{
        "feedback_strengths": "Strengths feedback based on technical depth, communication, and problem solving",
        "feedback_improvements": "Improvements feedback based on technical gaps, communication style, or problem solving",
        "score": 8,
        "next_question": "The next question text (or null if complete)",
        "is_complete": false
    }}
    """
    
    try:
        data = ask_gemini_json(prompt)
        result = {
            "feedback_strengths": data.get("feedback_strengths", "Solid attempt showing relevant knowledge."),
            "feedback_improvements": data.get("feedback_improvements", "Try to elaborate more on specific concepts or real-world application."),
            "score": int(data.get("score", 7)),
            "next_question": data.get("next_question"),
            "is_complete": bool(data.get("is_complete", is_last))
        }
        if result["next_question"]:
            _register_asked_question(role, difficulty, interview_type, result["next_question"])
        return result
    except Exception as e:
        logger.error(f"Error evaluating answer: {e}")
        fallback_next = None if is_last else "Can you describe a time you had to learn a new tool or framework quickly to solve a task?"
        if fallback_next:
            _register_asked_question(role, difficulty, interview_type, fallback_next)
        return {
            "feedback_strengths": "Thank you for sharing your answer.",
            "feedback_improvements": "Consider adding more concrete examples and technical details to strengthen your response.",
            "score": 7,
            "next_question": fallback_next,
            "is_complete": is_last
        }

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
    You are an expert technical interviewer and career coach for the {role} position.
    
    Review the following candidate's interview transcript and scores to generate a detailed performance report.
    
    Transcript:
    {history_text}
    
    Please analyze their responses and generate a professional final report containing:
    1. Overall Feedback: A detailed summary of their performance, domain expertise, communication style, and conceptual depth.
    2. Top Strengths: A list of 2-4 key areas where the candidate excelled (e.g., technical precision, problem solving, STAR structure).
    3. Key Weaknesses: A list of 2-4 key gaps or areas of concern observed during the interview.
    4. Improvement Plan: A list of 3-5 concrete action items or learning topics to help them bridge their gaps.
    5. Hiring Recommendation: A professional recommendation (e.g., "Strong Hire", "Pass", "Borderline - Recommend follow-up round") with a brief explanation.
    
    Return ONLY a JSON object with this exact structure:
    {{
        "overall_feedback": "Paragraph summarizing their overall performance.",
        "top_strengths": ["strength 1", "strength 2"],
        "key_weaknesses": ["weakness 1", "weakness 2"],
        "improvement_plan": ["step 1", "step 2", "step 3"],
        "hiring_recommendation": "Hiring recommendation with explanation."
    }}
    """
    
    try:
        data = ask_gemini_json(prompt)
        return {
            "average_score": avg_score,
            "overall_feedback": data.get("overall_feedback", "Completed the interview successfully. Showed good core potential."),
            "top_strengths": data.get("top_strengths", ["Attempted all questions", "Good communication"]),
            "key_weaknesses": data.get("key_weaknesses", ["Could provide more technical depth", "Use STAR method more"]),
            "improvement_plan": data.get("improvement_plan", ["Review core role fundamentals", "Practice behavioral questions"]),
            "hiring_recommendation": data.get("hiring_recommendation", "Recommend technical review of candidate's background.")
        }
    except Exception as e:
        logger.error(f"Error generating report: {e}")
        return {
            "average_score": avg_score,
            "overall_feedback": "Thank you for completing the interview coach session. Your answers have been recorded.",
            "top_strengths": ["Completed the interview", "Communicated answers"],
            "key_weaknesses": ["Technical depth needs review"],
            "improvement_plan": ["Practice role-specific mock interviews", "Review technical documentation"],
            "hiring_recommendation": "Recommend follow-up evaluation."
        }
