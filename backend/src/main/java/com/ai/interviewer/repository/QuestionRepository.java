package com.ai.interviewer.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ai.interviewer.model.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> 
{
	List<Question> findByJobRoleAndActiveTrueOrderByIdAsc(String jobRole);
	List<Question> findByJobRoleAndActiveTrue(String jobRole);
    long countByActiveTrue();

	@Query("""
	        SELECT q FROM Question q
	        WHERE q.active = true
	          AND (:jobRole IS NULL OR q.jobRole = :jobRole)
	          AND (:difficulty IS NULL OR q.difficulty = :difficulty)
	          AND (:search IS NULL 
	               OR LOWER(q.questionText) LIKE LOWER(CONCAT('%', :search, '%')))
	        ORDER BY q.createdAt DESC
	    """)
	    Page<Question> searchQuestions(
	        @Param("jobRole") String jobRole,
	        @Param("difficulty") String difficulty,
	        @Param("search") String search,
	        Pageable pageable
	    );
	
	@Query("""
		    SELECT q FROM Question q
		    WHERE q.jobRole = :jobRole
		      AND q.active = true
		      AND q.id NOT IN (
		          SELECT a.questionId
		          FROM Answer a
		          WHERE a.interviewId = :interviewId
		      )
		    ORDER BY q.id ASC
		""")
		List<Question> findUnansweredQuestions(
		    @Param("jobRole") String jobRole,
		    @Param("interviewId") Long interviewId
		);
	@Query("""
		    SELECT q
		    FROM Question q
		    WHERE q.jobRole = :jobRole
		      AND q.active = true
		      AND q.id NOT IN (
		          SELECT a.questionId
		          FROM Answer a
		          WHERE a.interviewId = :interviewId
		      )
		    ORDER BY function('RAND')
		""")
		List<Question> findRandomUnansweredQuestions(
		    @Param("jobRole") String jobRole,
		    @Param("interviewId") Long interviewId
		);
	@Query("""
		    SELECT q FROM Question q
		    WHERE q.jobRole = :jobRole
		      AND q.active = true
		    ORDER BY function('RAND')
		""")
		List<Question> findRandomQuestions(
		    @Param("jobRole") String jobRole,
		    Pageable pageable
		);

}
