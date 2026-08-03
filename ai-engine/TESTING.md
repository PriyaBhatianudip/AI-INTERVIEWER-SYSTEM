# Testing Guide

## Quick Start

### 1. Setup Environment

```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-key-here
```

### 2. Start the Server

```bash
# Option 1: Direct Python
python -m app.main

# Option 2: Uvicorn with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will be available at: `http://localhost:8000`

### 3. Test Endpoints

#### Health Check
```bash
curl http://localhost:8000/health
```

#### Test Answer Evaluation
```bash
curl -X POST http://localhost:8000/evaluate-answer \
  -H "Content-Type: application/json" \
  -d "{
    \"candidate_id\": 1,
    \"interview_session_id\": 101,
    \"question_id\": 1,
    \"job_role\": \"Software Engineer\",
    \"question_text\": \"What is polymorphism in OOP?\",
    \"ideal_answer\": \"Polymorphism allows objects of different classes to be treated as objects of a common parent class. It enables one interface to be used for different data types.\",
    \"key_points\": [\"Multiple forms\", \"Interface reusability\", \"Method overriding\", \"Runtime binding\"],
    \"candidate_answer\": \"Polymorphism means many forms. It allows us to use the same method name for different implementations in different classes through inheritance.\"
  }"
```

#### Test Adaptive Difficulty
```bash
curl -X POST http://localhost:8000/adaptive-next \
  -H "Content-Type: application/json" \
  -d "{
    \"job_role\": \"Software Engineer\",
    \"recent_history\": [
      {\"question_id\": 1, \"difficulty\": \"EASY\", \"score\": 85},
      {\"question_id\": 2, \"difficulty\": \"MEDIUM\", \"score\": 90}
    ]
  }"
```

#### Test Speech-to-Text
```bash
# Requires an audio file
curl -X POST http://localhost:8000/stt \
  -F "file=@path/to/audio.mp3"
```

#### Test Summary Generation
```bash
curl -X POST http://localhost:8000/summary \
  -H "Content-Type: application/json" \
  -d "{
    \"candidate_name\": \"John Doe\",
    \"job_role\": \"Software Engineer\",
    \"interview_session_id\": 101,
    \"evaluations\": [
      {
        \"question_id\": 1,
        \"question_text\": \"What is polymorphism?\",
        \"overall_score\": 85,
        \"accuracy_score\": 80,
        \"relevance_score\": 90,
        \"communication_score\": 85
      },
      {
        \"question_id\": 2,
        \"question_text\": \"Explain REST API principles\",
        \"overall_score\": 75,
        \"accuracy_score\": 70,
        \"relevance_score\": 80,
        \"communication_score\": 75
      }
    ]
  }"
```

## Interactive Testing

Visit `http://localhost:8000/docs` for Swagger UI - interactive API documentation where you can test all endpoints directly in your browser.

## Common Issues

### Issue: "OPENAI_API_KEY not found"
**Solution:** Make sure `.env` file exists with valid API key

### Issue: "Module not found"
**Solution:** Install dependencies: `pip install -r requirements.txt`

### Issue: Port already in use
**Solution:** Change port: `uvicorn app.main:app --port 8001`
