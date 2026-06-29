from pydantic import BaseModel


class CareerRequest(BaseModel):
    question: str


class CareerResponse(BaseModel):
    answer: str