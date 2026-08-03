import os
from typing import List
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.config import settings
from app.models import (
    AnswerEvaluationRequest, AnswerScore,
    SummaryRequest, SummaryResponse,
    AdaptiveRequest, AdaptiveResponse,
    STTResponse, ErrorResponse
)
from app.services.evaluation_service import EvaluationService
from app.services.summary_service import SummaryService
from app.services.adaptive_service import AdaptiveService
from app.services.stt_service import STTService

from app.routes import jd_routes, question_routes


app = FastAPI(
    title="AI Interview Engine",
    version="1.0.0",
    description="AI-powered interview evaluation system"
)
from app.routes import reports

app.include_router(reports.router)
from app.routes import compare
app.include_router(compare.router)
app.include_router(jd_routes.router)
app.include_router(question_routes.router, prefix="/ai")
app.include_router(jd_routes.router, prefix="/ai")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for your Spring Boot app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class AiCompareRequest(BaseModel):
    candidateName: str
    jobRole: str
    previousOverall: float
    recentOverall: float
    accuracyDiff: float
    relevanceDiff: float
    communicationDiff: float
    highlights: List[str]

class AiCompareResponse(BaseModel):
    comparisonSummary: str
    nextInterviewStrategy: str


@app.post("/compare-summary", response_model=AiCompareResponse)
def compare_summary(req: AiCompareRequest):

    trend = "improved" if req.recentOverall > req.previousOverall else "remained stable"

    comparison_text = (
        f"{req.candidateName} appeared for two {req.jobRole} interviews. "
        f"Overall performance has {trend}. "
        f"Accuracy change: {req.accuracyDiff:.2f}, "
        f"Relevance change: {req.relevanceDiff:.2f}, "
        f"Communication change: {req.communicationDiff:.2f}. "
        f"Key highlights include: {', '.join(req.highlights)}."
    )

    strategy = (
        "Focus on structured explanations, revise weak areas identified earlier, "
        "and practice mock interviews under time constraints. "
        "Attempt the next interview within one week for best momentum."
    )

    return AiCompareResponse(
        comparisonSummary=comparison_text,
        nextInterviewStrategy=strategy
    )
@app.get("/")
def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "service": "AI Interview Engine",
        "version": "1.0.0",
        "endpoints": ["/stt", "/evaluate-answer", "/summary", "/adaptive-next"]
    }

@app.get("/health")
def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "openai_configured": bool(settings.OPENAI_API_KEY),
        "directories": {
            "reports": os.path.exists(settings.REPORTS_DIR),
            "temp_audio": os.path.exists(settings.TEMP_AUDIO_DIR)
        }
    }

@app.post("/stt", response_model=STTResponse)
async def speech_to_text(file: UploadFile = File(...)):
    """
    Speech-to-Text endpoint.
    Accepts audio file and returns transcribed text.
    """
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in settings.ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Allowed: {', '.join(settings.ALLOWED_AUDIO_EXTENSIONS)}"
        )
    
    temp_name = f"temp_{uuid.uuid4().hex}{file_ext}"
    temp_path = os.path.join(settings.TEMP_AUDIO_DIR, temp_name)
    
    try:
        content = await file.read()
        with open(temp_path, "wb") as f:
            f.write(content)
        
        text = STTService.transcribe_audio(temp_path)
        
        return STTResponse(text=text)
    
    finally:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass

@app.post("/evaluate-answer", response_model=AnswerScore)
def evaluate_answer(req: AnswerEvaluationRequest):
    """Evaluate a candidate's answer."""
    return EvaluationService.evaluate_answer(req)

@app.post("/summary", response_model=SummaryResponse)
def generate_summary(req: SummaryRequest):
    """Generate comprehensive interview summary with PDF."""
    return SummaryService.generate_summary(req)

@app.post("/adaptive-next", response_model=AdaptiveResponse)
def adaptive_next_question(req: AdaptiveRequest):
    """Determine optimal difficulty for next question."""
    return AdaptiveService.get_next_difficulty(req)

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return ErrorResponse(
        message=exc.detail,
        status_code=exc.status_code
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
