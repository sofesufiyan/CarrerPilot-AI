from fastapi import APIRouter, UploadFile, File
import os

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

router = APIRouter()


# ----------------------------------------
# Career Advice Endpoint
# ----------------------------------------
@router.post("/career-advice", response_model=CareerResponse)
def career_advice(request: CareerRequest):
    answer = get_career_advice(request.question)
    return CareerResponse(answer=answer)


# ----------------------------------------
# Resume Upload Endpoint
# ----------------------------------------
@router.post("/resume-upload", response_model=ResumeResponse)
async def resume_upload(file: UploadFile = File(...)):
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
# Agent Logs Endpoint
# ----------------------------------------
@router.get("/agent-logs")
def agent_logs():
    return {
        "logs": get_logs()
    }