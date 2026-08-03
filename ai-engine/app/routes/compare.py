from fastapi import APIRouter
from app.models import CompareRequest, CompareResponse

router = APIRouter()

@router.post("/compare-summary", response_model=CompareResponse)
def generate_compare_summary(req: CompareRequest):
    summary = (
        f"Compared to the previous interview, the recent performance shows "
        f"a change in overall score from {req.previousOverall:.1f} to {req.recentOverall:.1f}. "
        f"Accuracy change: {req.accuracyDiff:.1f}, "
        f"Relevance change: {req.relevanceDiff:.1f}, "
        f"Communication change: {req.communicationDiff:.1f}. "
        f"Key observations: {', '.join(req.highlights)}."
    )

    strategy = [
        "Focus on strengthening weak concepts identified in the comparison",
        "Practice structured answers with examples",
        "Improve communication clarity with mock interviews"
    ]

    return CompareResponse(
        comparisonSummary=summary,
        nextInterviewStrategy=strategy
    )
