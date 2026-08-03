from fastapi import APIRouter
from app.models import QuestionGenRequest, QuestionGenResponse
from app.services.question_generator import generate_questions

router = APIRouter()

@router.post("/generate-questions", response_model=QuestionGenResponse)
def generate_ai_questions(req: QuestionGenRequest):
    questions = generate_questions(
        req.jobRole,
        req.skills,
        req.experienceLevel,
        req.count
    )

    return {"questions": questions}
