from openai import OpenAI
from fastapi import HTTPException
from app.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

class STTService:
    @staticmethod
    def transcribe_audio(file_path: str) -> str:
        """
        Transcribe audio file using OpenAI Whisper.
        """
        try:
            with open(file_path, "rb") as audio_file:
                transcript = client.audio.transcriptions.create(
                    model=settings.STT_MODEL,
                    file=audio_file,
                    response_format="text"
                )
            return transcript
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"STT API error: {str(e)}")
