from fastapi import APIRouter, Query

from services.spring_client import (
    fetch_progress_summary,
    fetch_timeline,
    fetch_skill_averages
)
from services.progress_ai import (
    calculate_improvement,
    analyze_skill_growth,
    calculate_consistency,
    generate_ai_insight
)

router = APIRouter(prefix="/progress", tags=["Progress"])


@router.get("/summary")
def progress_summary(user_id: int = Query(...)):
    summary = fetch_progress_summary(user_id)
    timeline = fetch_timeline(user_id)

    improvement, trend = calculate_improvement(timeline)

    summary["improvement"] = improvement
    summary["trend"] = trend

    return summary


@router.get("/analysis")
def progress_analysis(user_id: int = Query(...)):
    skill_data = fetch_skill_averages(user_id)
    timeline = fetch_timeline(user_id)

    strengths, weak_areas = analyze_skill_growth(
        skill_data["previous_average"],
        skill_data["current_average"]
    )

    consistency = calculate_consistency(timeline)
    improvement, trend = calculate_improvement(timeline)

    insight = generate_ai_insight(
        improvement,
        trend,
        strengths,
        weak_areas,
        consistency
    )

    return {
        "strengths": strengths,
        "weak_areas": weak_areas,
        "consistency": consistency,
        "ai_insight": insight
    }
