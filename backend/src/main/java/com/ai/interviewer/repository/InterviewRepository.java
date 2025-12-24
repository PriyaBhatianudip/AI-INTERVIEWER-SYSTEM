package com.ai.interviewer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ai.interviewer.model.Interview;

public interface InterviewRepository extends JpaRepository<Interview, Long> 
{
	
}
