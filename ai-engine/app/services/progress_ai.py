import statistics

# -------------------------------
# CORE AI LOGIC
# -------------------------------

def calculate_improvement(timeline):
    if len(timeline) < 2:
        return 0, "insufficient-data"

    start = timeline[0]["score"]
    end = timeline[-1]["score"]
    diff = round(end - start, 2)

    trend = "improving" if diff > 0 else "declining"
    return diff, trend


def analyze_skill_growth(previous, current):
    strengths = []
    weak_areas = []

    for skill in current:
        delta = current[skill] - previous.get(skill, 0)

        if delta >= 8:
            strengths.append({"skill": skill, "change": round(delta, 2)})
        elif delta <= -3:
            weak_areas.append({"skill": skill, "change": round(delta, 2)})

    return strengths, weak_areas


def calculate_consistency(timeline):
    scores = [t["score"] for t in timeline]

    if len(scores) < 3:
        return "insufficient-data"

    variance = statistics.pstdev(scores)

    if variance < 4:
        return "consistent"
    elif variance < 8:
        return "moderate"
    else:
        return "inconsistent"


def generate_ai_insight(improvement, trend, strengths, weak_areas, consistency):
    insight = ""

    if trend == "improving":
        insight += f"You have shown an overall improvement of {improvement}%. "
    else:
        insight += "Your recent performance shows a declining trend. "

    if strengths:
        strong_skills = ", ".join(s["skill"] for s in strengths)
        insight += f"Strong improvement is seen in {strong_skills}. "

    if weak_areas:
        weak_skills = ", ".join(w["skill"] for w in weak_areas)
        insight += f"Focus more on {weak_skills} to improve further. "

    if consistency == "inconsistent":
        insight += "Your performance varies significantly across interviews. Try maintaining structured answers."

    return insight.strip()
