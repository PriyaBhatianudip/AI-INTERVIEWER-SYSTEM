package com.ai.interviewer.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ai.interviewer.model.Interview;
import com.ai.interviewer.repository.InterviewRepository;

@Service
public class InterviewService 
{
	@Autowired
	private InterviewRepository interviewRepository;
	
	public Interview startInterview(Long userId)
	{
		Interview interview =new Interview();
		interview.setUserId(userId);
		interview.setStartTime(LocalDateTime.now());
		interview.setStatus("STARTED");
		return interviewRepository.save(interview);
	}
	
	 public Interview endInterview(Long interviewId) {
	        Interview interview = interviewRepository.findById(interviewId)
	                .orElseThrow(() -> new RuntimeException("Interview not found"));

	        interview.setStatus("COMPLETED");
	        interview.setEndTime(LocalDateTime.now());

	        return interviewRepository.save(interview);
	    }
}
