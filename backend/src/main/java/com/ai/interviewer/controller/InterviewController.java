package com.ai.interviewer.controller;

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
import com.ai.interviewer.dto.SubmitAnswerRequest;
import com.ai.interviewer.model.Answer;
import com.ai.interviewer.model.Interview;
import com.ai.interviewer.model.Question;
import com.ai.interviewer.service.InterviewService;
import com.ai.interviewer.service.InterviewSummaryService;


@RestController
@RequestMapping("/api/interview")
public class InterviewController 
{
	@Autowired
	private InterviewService interviewService;
	
	@Autowired
	private InterviewSummaryService interviewSummaryService;

	@GetMapping("/{interviewId}/summary")
	public AiSummaryResponse getInterviewSummary(@PathVariable Long interviewId) {
	    return interviewSummaryService.generateAiSummary(interviewId);
	}
	@PostMapping("/start")
	public Interview startInterview(
	        @RequestParam Long userId,
	        @RequestParam String jobRole
	) {
	    return interviewService.startInterview(userId, jobRole);
	}

	@PostMapping("/end/{interviewId}")
    public Interview endInterview(@PathVariable Long interviewId) {
        return interviewService.endInterview(interviewId);
    }
	
	@PostMapping("/submit-answer")
    public Answer submitAnswer(@RequestBody SubmitAnswerRequest request) {
		System.out.println("Request : "+request);
        return interviewService.submitAnswer(
                request
        );
    }
	
	@GetMapping("/next-question")
	public ResponseEntity<?> getNextQuestion(
	        @RequestParam Long interviewId,
	        @RequestParam String jobRole) {

	    Question nextQuestion = interviewService.getNextQuestion(interviewId, jobRole);

	    if (nextQuestion == null) {
	        return ResponseEntity.ok("Interview completed");
	    }

	    return ResponseEntity.ok(nextQuestion);
	}

//	@GetMapping("/{interviewId}/summary")
//	public InterviewSummary getSummary(@PathVariable Long interviewId) {
//	    return interviewService.generateSummary(interviewId);
//	}
}
