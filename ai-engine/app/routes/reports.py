from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

router = APIRouter(prefix="/reports", tags=["Reports"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
REPORTS_DIR = os.path.join(BASE_DIR, "reports")


@router.get("/{interview_id}/pdf")
def download_interview_pdf(interview_id: int):
    # Find matching PDF
    for file in os.listdir(REPORTS_DIR):
        if file.startswith(f"interview_report_{interview_id}_") and file.endswith(".pdf"):
            pdf_path = os.path.join(REPORTS_DIR, file)

            return FileResponse(
                pdf_path,
                media_type="application/pdf",
                filename=file,
            )

    raise HTTPException(status_code=404, detail="PDF not found for this interview")
