import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # API Keys
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Model Configuration
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gpt-4o-mini")
    STT_MODEL: str = os.getenv("STT_MODEL", "whisper-1")
    LLM_TEMPERATURE: float = float(os.getenv("LLM_TEMPERATURE", "0.3"))
    
    # Directory Configuration
    REPORTS_DIR: str = os.getenv("REPORTS_DIR", "reports")
    TEMP_AUDIO_DIR: str = os.getenv("TEMP_AUDIO_DIR", "tmp_audio")
    
    # File Upload Settings
    ALLOWED_AUDIO_EXTENSIONS = {".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm"}
    MAX_AUDIO_FILE_SIZE = 25 * 1024 * 1024  # 25MB
    
    def __init__(self):
        # Create necessary directories
        os.makedirs(self.REPORTS_DIR, exist_ok=True)
        os.makedirs(self.TEMP_AUDIO_DIR, exist_ok=True)

settings = Settings()
