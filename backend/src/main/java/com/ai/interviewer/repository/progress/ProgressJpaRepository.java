package com.ai.interviewer.repository.progress;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ai.interviewer.dto.progress.ProgressSummaryDto;
import com.ai.interviewer.dto.progress.ScoreTimelineDto;
import com.ai.interviewer.model.Interview;

public interface ProgressJpaRepository extends JpaRepository<Interview, Long> {

    @Query("""
        SELECT new com.ai.interviewer.dto.progress.ProgressSummaryDto(
            COALESCE(AVG(s.finalScore), 0),
            COUNT(i),
            MAX(i.endTime)
        )
        FROM Interview i
        LEFT JOIN InterviewSummaryEntity s
               ON s.interviewId = i.id
        WHERE i.userId = :userId
          AND i.status = 'COMPLETED'
    """)
    ProgressSummaryDto fetchSummary(@Param("userId") Long userId);

    @Query("""
        SELECT new com.ai.interviewer.dto.progress.ScoreTimelineDto(
            i.endTime,
            s.finalScore
        )
        FROM Interview i
        JOIN InterviewSummaryEntity s
             ON s.interviewId = i.id
        WHERE i.userId = :userId
          AND i.status = 'COMPLETED'
        ORDER BY i.endTime
    """)
    List<ScoreTimelineDto> fetchTimeline(@Param("userId") Long userId);
}
