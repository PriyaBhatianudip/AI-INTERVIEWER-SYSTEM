def generate_questions(job_role, skills, experience, count):
    questions = []

    for i in range(count):
        topic = skills[i % len(skills)] if skills else "Core Concepts"

        questions.append({
            "id": i + 1,
            "question": f"Explain a real-world use of {topic} in a {job_role} role.",
            "difficulty": experience,
            "topic": topic
        })

    return questions
