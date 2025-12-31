package com.ai.interviewer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ai.interviewer.model.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Long>
{
	List<Answer> findByInterviewId(Long interviewId);
}
