from fastapi import APIRouter, Depends, Request, HTTPException
from pydantic import BaseModel
import logging
from typing import List, Dict, Any, Optional

from app.auth.dependencies import get_current_user, UserSession
from app.services.interview_service import start_interview, evaluate_answer, generate_report
from app.db.database import save_interview_session, get_interview_history

logger = logging.getLogger("uvicorn.error")

router = APIRouter(prefix="/interview", tags=["Interview Coach"])

class StartInterviewRequest(BaseModel):
    role: str
    difficulty: str
    type: str

class EvaluateAnswerRequest(BaseModel):
    role: str
    difficulty: str
    type: str
    question: str
    user_answer: str
    current_index: int
    total_questions: int

class CompleteInterviewRequest(BaseModel):
    role: str
    difficulty: str
    type: str
    history: List[Dict[str, Any]]

@router.post("/start")
def api_start_interview(req: StartInterviewRequest, user: UserSession = Depends(get_current_user)):
    try:
        first_question = start_interview(req.role, req.difficulty, req.type)
        return {"question": first_question}
    except Exception as e:
        logger.error(f"Error in /interview/start: {e}")
        raise HTTPException(status_code=500, detail="Failed to start interview.")

@router.post("/evaluate")
def api_evaluate_answer(req: EvaluateAnswerRequest, user: UserSession = Depends(get_current_user)):
    try:
        result = evaluate_answer(
            req.role, req.difficulty, req.type, req.question, req.user_answer, req.current_index, req.total_questions
        )
        return result
    except Exception as e:
        logger.error(f"Error in /interview/evaluate: {e}")
        raise HTTPException(status_code=500, detail="Failed to evaluate answer.")

@router.post("/complete")
def api_complete_interview(req: CompleteInterviewRequest, user: UserSession = Depends(get_current_user)):
    try:
        report = generate_report(req.role, req.history)
        
        # Save to DB
        session_id = save_interview_session(
            uid=user.uid,
            role=req.role,
            difficulty=req.difficulty,
            interview_type=req.type,
            data=report
        )
        report["session_id"] = session_id
        return report
    except Exception as e:
        logger.error(f"Error in /interview/complete: {e}")
        raise HTTPException(status_code=500, detail="Failed to complete interview.")

@router.get("/history")
def api_interview_history(user: UserSession = Depends(get_current_user)):
    try:
        history = get_interview_history(user.uid)
        return {"history": history}
    except Exception as e:
        logger.error(f"Error in /interview/history: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch interview history.")
