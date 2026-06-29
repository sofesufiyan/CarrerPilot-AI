from fastapi import APIRouter

from app.models.schemas import CareerRequest, CareerResponse
from app.services.career_service import get_career_advice

router = APIRouter()


@router.post("/career-advice", response_model=CareerResponse)
def career_advice(request: CareerRequest):
    answer = get_career_advice(request.question)
    return CareerResponse(answer=answer)

