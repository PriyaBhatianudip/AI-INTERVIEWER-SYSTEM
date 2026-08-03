from pydantic import BaseModel
from typing import List


class CompareRequest(BaseModel):
    candidateName: str
    jobRole: str
    previousOverall: float
    recentOverall: float
    accuracyDiff: float
    relevanceDiff: float
    communicationDiff: float
    highlights: List[str]


class CompareResponse(BaseModel):
    comparisonSummary: str
    nextInterviewStrategy: str
