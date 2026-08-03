import os
import uuid
from datetime import datetime
from typing import List
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from app.config import settings
from app.models import SummaryResponse

def generate_pdf_report(
    summary: SummaryResponse,
    candidate_name: str,
    job_role: str,
    session_id: int
) -> str:
    """
    Generate a professional PDF report with the interview summary.
    """
    file_name = f"interview_report_{session_id}_{uuid.uuid4().hex[:8]}.pdf"
    file_path = os.path.join(settings.REPORTS_DIR, file_name)

    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4
    y = height - 50

    # Title
    c.setFont("Helvetica-Bold", 20)
    c.drawString(50, y, "AI Interview Evaluation Report")
    y -= 50

    # Candidate Info
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Candidate Information")
    y -= 20
    c.setFont("Helvetica", 11)
    c.drawString(70, y, f"Name: {candidate_name}")
    y -= 18
    c.drawString(70, y, f"Position: {job_role}")
    y -= 18
    c.drawString(70, y, f"Session ID: {session_id}")
    y -= 18
    c.drawString(70, y, f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    y -= 30

    # Overall Rating
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, f"Overall Rating: {summary.overall_rating_10:.1f} / 10")
    y -= 35

    def draw_multiline_text(text: str, x: int, y_start: int, max_width: int) -> int:
        words = text.split()
        line = ""
        current_y = y_start
        
        for word in words:
            test_line = line + word + " "
            if c.stringWidth(test_line, "Helvetica", 11) < max_width:
                line = test_line
            else:
                if current_y < 80:
                    c.showPage()
                    current_y = height - 50
                c.drawString(x, current_y, line.strip())
                current_y -= 16
                line = word + " "
        
        if line:
            if current_y < 80:
                c.showPage()
                current_y = height - 50
            c.drawString(x, current_y, line.strip())
            current_y -= 16
        
        return current_y

    def draw_section(title: str, items: List[str], bullet: bool = True):
        nonlocal y
        if not items:
            return
        
        if y < 100:
            c.showPage()
            y = height - 50
        
        c.setFont("Helvetica-Bold", 13)
        c.drawString(50, y, title)
        y -= 22
        
        c.setFont("Helvetica", 11)
        for item in items:
            if y < 80:
                c.showPage()
                y = height - 50
            
            prefix = "• " if bullet else ""
            y = draw_multiline_text(f"{prefix}{item}", 70, y, width - 120)
            y -= 8
        
        y -= 15

    draw_section("Executive Summary", summary.summary_paragraphs, bullet=False)
    draw_section("Key Strengths", summary.strengths)
    draw_section("Areas for Improvement", summary.improvement_areas)
    draw_section("Recommended Learning Path", summary.learning_path)
    
    # Final Recommendation
    if y < 100:
        c.showPage()
        y = height - 50
    
    c.setFont("Helvetica-Bold", 13)
    c.drawString(50, y, "Final Recommendation")
    y -= 22
    c.setFont("Helvetica", 11)
    y = draw_multiline_text(summary.recommendation, 70, y, width - 120)

    c.showPage()
    c.save()
    return file_path
