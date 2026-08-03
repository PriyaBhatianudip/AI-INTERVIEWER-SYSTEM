import json
from fastapi import HTTPException
from app.models import SummaryRequest, SummaryResponse
from app.prompts import SUMMARY_PROMPT
from app.services.llm_service import LLMService
from app.utils.json_parser import extract_json_from_response
from app.utils.pdf_generator import generate_pdf_report

class SummaryService:
    @staticmethod
    def generate_summary(req: SummaryRequest) -> SummaryResponse:
        """
        Generate comprehensive interview summary with PDF report.
        """
        evaluations_json = json.dumps(req.evaluations, indent=2)
        
        prompt = SUMMARY_PROMPT.format(
            candidate_name=req.candidate_name,
            job_role=req.job_role,
            evaluations_json=evaluations_json
        )
        
        raw_response = LLMService.call_llm(prompt, max_tokens=3000)
        
        try:
            data = extract_json_from_response(raw_response)
        except ValueError as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse LLM response: {str(e)}")
            # ================= AGGREGATE SCORES =================
        evaluations = req.evaluations or []

        def avg(key):
            values = [
            float(e.get(key, 0))
                for e in evaluations
                if e.get(key) is not None
            ]
            return round(sum(values) / len(values), 2) if values else 0.0

        average_accuracy = avg("accuracy")
        average_relevance = avg("relevance")
        average_communication = avg("communication")

        try:
            summary = SummaryResponse(
            overall_rating_10=float(data.get("overall_rating_10", 0.0)),

            # 🔹 Aggregated scores
            average_accuracy=average_accuracy,
            average_relevance=average_relevance,
            average_communication=average_communication,

            summary_paragraphs=data.get("summary_paragraphs", []),
            strengths=data.get("strengths", []),
            improvement_areas=data.get("improvement_areas", []),
            learning_path=data.get("learning_path", []),
            recommendation=data.get("recommendation", "")
        )

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Invalid response format: {str(e)}")
        
        # Generate PDF
        try:
            pdf_path = generate_pdf_report(
                summary,
                req.candidate_name,
                req.job_role,
                req.interview_session_id
            )
            summary.pdf_path = pdf_path
        except Exception as e:
            print(f"PDF generation failed: {str(e)}")
            summary.pdf_path = None
        
        return summary
