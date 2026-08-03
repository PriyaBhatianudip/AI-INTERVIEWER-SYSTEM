from pydantic import BaseModel, Field
from typing import List, Optional

class AnswerEvaluationRequest(BaseModel):
    candidate_id: int
    interview_session_id: int
    question_id: int
    job_role: str
    question_text: str
    ideal_answer: str
    key_points: List[str]
    candidate_answer: str

class AnswerScore(BaseModel):
    accuracy_score: float = Field(..., ge=0, le=100)
    relevance_score: float = Field(..., ge=0, le=100)
    communication_score: float = Field(..., ge=0, le=100)
    sentiment: str
    confidence: str
    overall_score: float = Field(..., ge=0, le=100)
    strengths: List[str]
    weaknesses: List[str]
    improvement_tips: List[str]

class SummaryRequest(BaseModel):
    candidate_name: str
    job_role: str
    interview_session_id: int
    evaluations: List[dict]

class SummaryResponse(BaseModel):
    overall_rating_10: float

    average_accuracy: float = 0.0
    average_relevance: float = 0.0
    average_communication: float = 0.0

    summary_paragraphs: list[str]
    strengths: list[str]
    improvement_areas: list[str]
    learning_path: list[str]
    recommendation: str
    pdf_path: str | None = None

class AdaptiveRequest(BaseModel):
    job_role: str
    recent_history: List[dict]

class AdaptiveResponse(BaseModel):
    next_difficulty: str
    reason: str

class STTResponse(BaseModel):
    text: str

class ErrorResponse(BaseModel):
    error: bool = True
    message: str
    status_code: int
class CompareRequest(BaseModel):
    candidateName: str
    jobRole: str
    previousOverall: float
    recentOverall: float
    accuracyDiff: float
    relevanceDiff: float
    communicationDiff: float
    highlights: List[str]
class CompareResponse(BaseModel):
    comparisonSummary: str
    nextInterviewStrategy: List[str]
class JDAnalysisResponse(BaseModel):
    jobRole: str
    skills: List[str]
    experienceLevel: str
    responsibilities: List[str]    
class QuestionGenRequest(BaseModel):
    jobRole: str
    skills: List[str] = []
    experienceLevel: str = "mid"
    count: int = 5

class InterviewQuestion(BaseModel):
    id: int
    question: str
    difficulty: str
    topic: str

class QuestionGenResponse(BaseModel):
    questions: List[InterviewQuestion]
