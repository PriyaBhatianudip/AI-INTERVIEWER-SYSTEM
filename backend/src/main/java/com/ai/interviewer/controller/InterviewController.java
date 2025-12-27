package com.ai.interviewer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.interviewer.dto.SubmitAnswerRequest;
import com.ai.interviewer.model.Answer;
import com.ai.interviewer.model.Interview;
import com.ai.interviewer.service.InterviewService;


@RestController
@RequestMapping("/api/interview")
public class InterviewController 
{
	@Autowired
	private InterviewService interviewService;
	
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

        return interviewService.submitAnswer(
                request.getUserId(),
                request.getInterviewId(),
                request.getQuestionId(),
                request.getCandidateAnswer()
        );
    }
}
