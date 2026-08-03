package com.ai.interviewer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ai.interviewer.model.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Long>
{
	List<Answer> findByInterviewId(Long interviewId);
	boolean existsByInterviewIdAndQuestionId(Long interviewId, Long questionId);
	@Query("""
		    SELECT DISTINCT a FROM Answer a
		    LEFT JOIN FETCH a.strengths
		    LEFT JOIN FETCH a.weaknesses
		    LEFT JOIN FETCH a.improvementTips
		    WHERE a.interviewId = :interviewId
		""")
	List<Answer> findByInterviewIdWithInsights(@Param("interviewId") Long interviewId);
	@Query("select s from Answer a join a.strengths s where a.id = :answerId")
	List<String> findStrengths(@Param("answerId") Long answerId);

	@Query("select w from Answer a join a.weaknesses w where a.id = :answerId")
	List<String> findWeaknesses(@Param("answerId") Long answerId);

	@Query("select t from Answer a join a.improvementTips t where a.id = :answerId")
	List<String> findImprovementTips(@Param("answerId") Long answerId);

}
