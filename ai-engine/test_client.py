"""
Simple test client to verify all endpoints work correctly.
Run this after starting the server.
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint"""
    print("\n=== Testing Health Check ===")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_evaluate_answer():
    """Test answer evaluation endpoint"""
    print("\n=== Testing Answer Evaluation ===")
    
    payload = {
        "candidate_id": 1,
        "interview_session_id": 101,
        "question_id": 1,
        "job_role": "Software Engineer",
        "question_text": "What is polymorphism in Object-Oriented Programming?",
        "ideal_answer": "Polymorphism allows objects of different classes to be treated as objects of a common parent class. It enables one interface to be used for different data types.",
        "key_points": [
            "Multiple forms",
            "Interface reusability",
            "Method overriding",
            "Runtime binding"
        ],
        "candidate_answer": "Polymorphism means many forms. It allows us to use the same method name for different implementations in different classes through inheritance. For example, a draw() method can work differently for Circle and Square classes."
    }
    
    response = requests.post(f"{BASE_URL}/evaluate-answer", json=payload)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Overall Score: {result['overall_score']}")
        print(f"Accuracy: {result['accuracy_score']}")
        print(f"Relevance: {result['relevance_score']}")
        print(f"Communication: {result['communication_score']}")
        print(f"Sentiment: {result['sentiment']}")
        print(f"Confidence: {result['confidence']}")
        print(f"Strengths: {result['strengths']}")
        print(f"Weaknesses: {result['weaknesses']}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_adaptive_difficulty():
    """Test adaptive difficulty endpoint"""
    print("\n=== Testing Adaptive Difficulty ===")
    
    payload = {
        "job_role": "Software Engineer",
        "recent_history": [
            {"question_id": 1, "difficulty": "EASY", "score": 85},
            {"question_id": 2, "difficulty": "MEDIUM", "score": 90},
            {"question_id": 3, "difficulty": "MEDIUM", "score": 88}
        ]
    }
    
    response = requests.post(f"{BASE_URL}/adaptive-next", json=payload)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Next Difficulty: {result['next_difficulty']}")
        print(f"Reason: {result['reason']}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_summary():
    """Test summary generation endpoint"""
    print("\n=== Testing Summary Generation ===")
    
    payload = {
        "candidate_name": "John Doe",
        "job_role": "Software Engineer",
        "interview_session_id": 101,
        "evaluations": [
            {
                "question_id": 1,
                "question_text": "What is polymorphism?",
                "overall_score": 85,
                "accuracy_score": 80,
                "relevance_score": 90,
                "communication_score": 85,
                "sentiment": "POSITIVE",
                "confidence": "HIGH"
            },
            {
                "question_id": 2,
                "question_text": "Explain REST API principles",
                "overall_score": 75,
                "accuracy_score": 70,
                "relevance_score": 80,
                "communication_score": 75,
                "sentiment": "NEUTRAL",
                "confidence": "MEDIUM"
            },
            {
                "question_id": 3,
                "question_text": "What is dependency injection?",
                "overall_score": 65,
                "accuracy_score": 60,
                "relevance_score": 70,
                "communication_score": 65,
                "sentiment": "NEUTRAL",
                "confidence": "MEDIUM"
            }
        ]
    }
    
    response = requests.post(f"{BASE_URL}/summary", json=payload)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Overall Rating: {result['overall_rating_10']}/10")
        print(f"Recommendation: {result['recommendation']}")
        print(f"PDF Path: {result.get('pdf_path', 'Not generated')}")
        print(f"Strengths: {result['strengths']}")
        print(f"Improvement Areas: {result['improvement_areas']}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("AI Interview Engine - Test Suite")
    print("=" * 60)
    print(f"Testing server at: {BASE_URL}")
    print("Make sure the server is running!")
    print("=" * 60)
    
    results = {
        "Health Check": test_health(),
        "Answer Evaluation": test_evaluate_answer(),
        "Adaptive Difficulty": test_adaptive_difficulty(),
        "Summary Generation": test_summary()
    }
    
    print("\n" + "=" * 60)
    print("Test Results Summary")
    print("=" * 60)
    for test_name, passed in results.items():
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"{test_name}: {status}")
    
    all_passed = all(results.values())
    print("=" * 60)
    if all_passed:
        print("✓ All tests passed!")
    else:
        print("✗ Some tests failed. Check the output above.")
    print("=" * 60)

if __name__ == "__main__":
    main()
