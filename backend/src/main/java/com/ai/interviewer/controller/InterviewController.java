package com.ai.interviewer.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.interviewer.dto.AiSummaryResponse;
import com.ai.interviewer.dto.InterviewSummary;
import com.ai.interviewer.dto.SubmitAnswerRequest;
import com.ai.interviewer.dto.admin.InterviewReportListResponse;
import com.ai.interviewer.model.Answer;
import com.ai.interviewer.model.Interview;
import com.ai.interviewer.model.Question;
import com.ai.interviewer.service.InterviewService;
import com.ai.interviewer.service.InterviewSummaryService;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @Autowired
    private InterviewSummaryService interviewSummaryService;

    /* ================= START INTERVIEW ================= */

    @PostMapping("/start")
    public Interview startInterview(
            @RequestParam Long userId,
            @RequestParam String jobRole
    ) {
        Interview interview = interviewService.startInterview(userId, jobRole);
        System.out.println("Job Role : "+jobRole);
        // 🔒 lock questions for this interview (IMPORTANT)
        interviewService.prepareInterviewQuestions(
                interview.getId(),
                jobRole,
                5   // total questions
        );

        return interview;
    }

    /* ================= GET INTERVIEW QUESTIONS ================= */

    @GetMapping("/{interviewId}/questions")
    public ResponseEntity<List<Question>> getInterviewQuestions(
            @PathVariable Long interviewId
    ) {
        return ResponseEntity.ok(
                interviewService.getInterviewQuestions(interviewId)
        );
    }

    /* ================= SUBMIT SINGLE ANSWER ================= */

    @PostMapping("/submit-answer")
    public ResponseEntity<Answer> submitAnswer(
            @RequestBody SubmitAnswerRequest request
    ) {
        return ResponseEntity.ok(
                interviewService.submitAnswer(request)
        );
    }

    /* ================= SUBMIT ALL & END ================= */

    @PostMapping("/{interviewId}/submit-all")
    public ResponseEntity<InterviewSummary> submitAllAnswers(
            @PathVariable Long interviewId,
            @RequestBody List<SubmitAnswerRequest> answers
    ) {
        return ResponseEntity.ok(
            interviewService.submitAllAnswers(interviewId, answers)
        );
    }


    /* ================= AI SUMMARY ================= */

    @GetMapping("/{interviewId}/summary")
    public AiSummaryResponse getInterviewSummary(
            @PathVariable Long interviewId
    ) {
        return interviewSummaryService.generateAiSummary(interviewId);
    }

    /* ================= USER HISTORY ================= */

    @GetMapping("/user/{userId}/history")
    public ResponseEntity<List<InterviewReportListResponse>> getUserPastInterviews(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                interviewService.getUserPastInterviews(userId)
        );
    }
}
