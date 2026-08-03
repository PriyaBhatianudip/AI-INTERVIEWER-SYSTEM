import json
from fastapi import HTTPException
from app.models import AdaptiveRequest, AdaptiveResponse
from app.prompts import ADAPTIVE_PROMPT
from app.services.llm_service import LLMService
from app.utils.json_parser import extract_json_from_response

class AdaptiveService:
    VALID_DIFFICULTIES = {"EASY", "MEDIUM", "HARD", "EXPERT"}
    
    @staticmethod
    def get_next_difficulty(req: AdaptiveRequest) -> AdaptiveResponse:
        """
        Determine optimal difficulty level for next question.
        """
        history_json = json.dumps(req.recent_history, indent=2)
        
        prompt = ADAPTIVE_PROMPT.format(
            job_role=req.job_role,
            history_json=history_json
        )
        
        raw_response = LLMService.call_llm(prompt, max_tokens=500)
        
        try:
            data = extract_json_from_response(raw_response)
        except ValueError as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse LLM response: {str(e)}")
        
        difficulty = data.get("next_difficulty", "MEDIUM").upper()
        
        if difficulty not in AdaptiveService.VALID_DIFFICULTIES:
            difficulty = "MEDIUM"
        
        return AdaptiveResponse(
            next_difficulty=difficulty,
            reason=data.get("reason", "Based on performance analysis")
        )
