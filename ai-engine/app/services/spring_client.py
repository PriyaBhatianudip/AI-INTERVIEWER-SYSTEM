import requests

SPRING_BASE_URL = "http://localhost:8080/api"

def fetch_progress_summary(user_id: int):
    return requests.get(
        f"{SPRING_BASE_URL}/progress/summary",
        params={"userId": user_id}
    ).json()

def fetch_timeline(user_id: int):
    return requests.get(
        f"{SPRING_BASE_URL}/progress/timeline",
        params={"userId": user_id}
    ).json()

def fetch_skill_averages(user_id: int):
    return requests.get(
        f"{SPRING_BASE_URL}/progress/skills",
        params={"userId": user_id}
    ).json()
