from fastapi import APIRouter, UploadFile, File, Depends, Request
import os
import logging

from app.models.schemas import (
    CareerRequest,
    CareerResponse,
    ResumeResponse,
)
from app.services.career_service import (
    get_career_advice,
    review_resume,
)
from app.services.pdf_service import extract_text_from_pdf
from app.tools.agent_logger import get_logs

# Import authentication dependencies
from app.auth.dependencies import get_current_user, UserSession

logger = logging.getLogger("uvicorn.error")

router = APIRouter()


# ----------------------------------------
# Career Advice Endpoint (Guarded)
# ----------------------------------------
@router.post("/career-advice", response_model=CareerResponse)
def career_advice(
    request: Request,
    body: CareerRequest,
    user: UserSession = Depends(get_current_user)
):
    # Demonstrate downstream access to request.state.user
    active_user = request.state.user
    logger.info(f"Route Access: '/career-advice' requested by User UID: {active_user.uid} ({active_user.email})")

    # Maintain existing business logic
    answer = get_career_advice(body.question)
    return CareerResponse(answer=answer)


# ----------------------------------------
# Resume Upload Endpoint (Guarded)
# ----------------------------------------
@router.post("/resume-upload", response_model=ResumeResponse)
async def resume_upload(
    request: Request,
    file: UploadFile = File(...),
    user: UserSession = Depends(get_current_user)
):
    # Demonstrate downstream access to request.state.user
    active_user = request.state.user
    logger.info(f"Route Access: '/resume-upload' initiated by User UID: {active_user.uid} ({active_user.email})")

    # Maintain existing business logic
    temp_path = f"temp_{file.filename}"

    try:
        # Save uploaded PDF temporarily
        with open(temp_path, "wb") as buffer:
            buffer.write(await file.read())

        # Extract text from PDF
        resume_text = extract_text_from_pdf(temp_path)

    finally:
        # Always remove temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

    analysis = review_resume(resume_text)

    analysis["filename"] = file.filename

    return ResumeResponse(**analysis)


# ----------------------------------------
# Agent Logs Endpoint (Guarded)
# ----------------------------------------
@router.get("/agent-logs")
def agent_logs(
    request: Request,
    user: UserSession = Depends(get_current_user)
):
    # Demonstrate downstream access to request.state.user
    active_user = request.state.user
    logger.info(f"Route Access: '/agent-logs' requested by User UID: {active_user.uid} ({active_user.email})")

    # Maintain existing business logic
    return {
        "logs": get_logs()
    }