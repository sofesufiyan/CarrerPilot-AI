from fastapi import APIRouter

router = APIRouter()


@router.post("/career-roadmap")
def career_roadmap():
    return {
        "message": "Career Roadmap API is working!"
    }