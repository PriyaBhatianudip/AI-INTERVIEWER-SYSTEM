from openai import OpenAI
from fastapi import HTTPException
from app.config import settings
import json
import logging

client = OpenAI(api_key=settings.OPENAI_API_KEY)

logger = logging.getLogger(__name__)

class LLMService:
    @staticmethod
    def call_llm(prompt: str, max_tokens: int = 2000) -> str:
        """
        Call OpenAI LLM safely.
        ALWAYS returns valid JSON string.
        NEVER raises exception to break interview flow.
        """

        try:
            response = client.chat.completions.create(
                model=settings.LLM_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an expert technical interviewer and evaluator. "
                            "Always respond with valid JSON only. "
                            "Never include explanations or markdown."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=settings.LLM_TEMPERATURE,
                max_tokens=max_tokens,
                timeout=30  # ⏱ prevent hanging
            )

            content = response.choices[0].message.content.strip()

            # 🔒 Validate JSON
            json.loads(content)
            return content

        except Exception as e:
            # 🚨 Log real error (for debugging)
            logger.error("LLM FAILURE: %s", str(e))

            # ✅ SAFE FALLBACK JSON (never fail interview)
            fallback = {
                "accuracy_score": 0.0,
                "relevance_score": 0.0,
                "communication_score": 0.0,
                "overall_score": 0.0,
                "sentiment": "neutral",
                "confidence": "low",
                "strengths": [],
                "weaknesses": [
                    "AI evaluation unavailable due to system connectivity issue."
                ],
                "improvement_tips": [
                    "Retry evaluation later when AI service is available.",
                    "Continue practicing interview questions."
                ]
            }

            return json.dumps(fallback)
