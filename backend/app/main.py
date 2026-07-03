from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

app = FastAPI(
    title="CareerPilot-AI",
    version="1.0.0",
    description="AI Career Mentor built with Google ADK",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.on_event("startup")
def on_startup():
    from app.db.database import init_db
    init_db()


@app.get("/")
def home():
    return {
        "message": "Welcome to CareerPilot-AI 🚀"
    }