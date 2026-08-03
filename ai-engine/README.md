# AI Interview Engine

AI-powered interview evaluation system with speech-to-text, answer evaluation, and adaptive difficulty.

## Features

- 🎤 Speech-to-Text transcription
- 📊 Detailed answer evaluation with scores
- 📄 PDF report generation
- 🎯 Adaptive difficulty adjustment
- 🤖 OpenAI GPT-4 & Whisper integration

## Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

3. **Run the server:**
```bash
python -m app.main
# Or use uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

- `GET /` - Health check
- `POST /stt` - Transcribe audio to text
- `POST /evaluate-answer` - Evaluate single answer
- `POST /summary` - Generate interview summary + PDF
- `POST /adaptive-next` - Get next question difficulty

## Testing

```bash
curl http://localhost:8000/health
```

## Integration with Spring Boot

Configure your Spring Boot `application.yml`:

```yaml
ai:
  service:
    base-url: http://localhost:8000
    endpoints:
      stt: /stt
      evaluate: /evaluate-answer
      summary: /summary
      adaptive: /adaptive-next
```
