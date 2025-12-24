package com.ai.interviewer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ai.interviewer.model.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> 
{

}
