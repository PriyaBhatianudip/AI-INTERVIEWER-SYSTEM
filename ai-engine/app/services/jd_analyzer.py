def analyze_jd_text(text: str):
    text_lower = text.lower()

    skills = []
    if "spring" in text_lower:
        skills.append("Spring Boot")
    if "microservice" in text_lower:
        skills.append("Microservices")
    if "docker" in text_lower:
        skills.append("Docker")
    if "aws" in text_lower:
        skills.append("AWS")

    experience = "mid"
    if "senior" in text_lower or "5+" in text_lower:
        experience = "senior"
    elif "junior" in text_lower or "1-2" in text_lower:
        experience = "junior"

    return {
        "jobRole": "Java Developer",
        "skills": skills,
        "experienceLevel": experience,
        "responsibilities": [
            "Build backend services",
            "Design REST APIs",
            "Work on scalable systems"
        ]
    }
