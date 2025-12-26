package com.ai.interviewer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ai.interviewer.model.Interview;
import com.ai.interviewer.service.InterviewService;


@RestController
@RequestMapping("/api/interview")
public class InterviewController 
{
	@Autowired
	private InterviewService interviewService;
	
	@PostMapping("/start/{userId}")
	public Interview startInterview(@PathVariable Long userId)
	{
		return interviewService.startInterview(userId);
	}
	@PostMapping("/end/{interviewId}")
    public Interview endInterview(@PathVariable Long interviewId) {
        return interviewService.endInterview(interviewId);
    }
}
