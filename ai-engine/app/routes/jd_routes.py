from fastapi import APIRouter, UploadFile, File
from app.services.jd_analyzer import analyze_jd_text

router = APIRouter()

@router.post("/jd/analyze")
async def analyze_jd(jd: UploadFile = File(...)):
    content = await jd.read()
    text = content.decode("utf-8", errors="ignore")

    return analyze_jd_text(text)
