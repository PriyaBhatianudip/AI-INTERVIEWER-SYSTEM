package com.ai.interviewer.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ai.interviewer.model.InterviewQuestion;
import com.ai.interviewer.model.Question;

@Repository
public interface InterviewQuestionRepository
        extends JpaRepository<InterviewQuestion, Long> {

	@Query("""
    SELECT q
    FROM Question q
    JOIN InterviewQuestion iq
      ON q.id = iq.questionId
    WHERE iq.interviewId = :interviewId
    ORDER BY iq.id
""")
List<Question> findQuestionsByInterviewId(Long interviewId);
}

