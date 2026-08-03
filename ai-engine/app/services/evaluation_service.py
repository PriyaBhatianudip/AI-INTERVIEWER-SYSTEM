from fastapi import HTTPException
from app.models import AnswerEvaluationRequest, AnswerScore
from app.prompts import EVAL_PROMPT
from app.services.llm_service import LLMService
from app.utils.json_parser import extract_json_from_response

class EvaluationService:
    @staticmethod
    def evaluate_answer(req: AnswerEvaluationRequest) -> AnswerScore:
        """
        Evaluate a candidate's answer to an interview question.
        """
        prompt = EVAL_PROMPT.format(
            question=req.question_text,
            ideal_answer=req.ideal_answer,
            key_points=", ".join(req.key_points),
            candidate_answer=req.candidate_answer
        )
        
        raw_response = LLMService.call_llm(prompt)
        
        try:
            data = extract_json_from_response(raw_response)
        except ValueError as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse LLM response: {str(e)}")
        
        try:
            return AnswerScore(
                accuracy_score=float(data.get("accuracy_score", 0.0)),
                relevance_score=float(data.get("relevance_score", 0.0)),
                communication_score=float(data.get("communication_score", 0.0)),
                sentiment=data.get("sentiment", "NEUTRAL"),
                confidence=data.get("confidence", "UNCERTAIN"),
                overall_score=float(data.get("overall_score", 0.0)),
                strengths=data.get("strengths", []),
                weaknesses=data.get("weaknesses", []),
                improvement_tips=data.get("improvement_tips", [])
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid response format: {str(e)}")
def aggregate_scores(evaluations: list[dict]) -> dict:
    if not evaluations:
        return {
            "averageAccuracy": 0,
            "averageRelevance": 0,
            "averageCommunication": 0,
        }

    acc = sum(e.get("accuracy", 0) for e in evaluations)
    rel = sum(e.get("relevance", 0) for e in evaluations)
    comm = sum(e.get("communication", 0) for e in evaluations)

    count = len(evaluations)

    return {
        "averageAccuracy": round(acc / count, 2),
        "averageRelevance": round(rel / count, 2),
        "averageCommunication": round(comm / count, 2),
    }
