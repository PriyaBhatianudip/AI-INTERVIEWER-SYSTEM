package com.ai.interviewer.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ai.interviewer.model.InterviewSummaryEntity;

public interface InterviewSummaryRepository
        extends JpaRepository<InterviewSummaryEntity, Long> {

    /* ================= USER REPORTS ================= */

    // Fetch summary by interview
    Optional<InterviewSummaryEntity> findByInterviewId(Long interviewId);

    // Fetch all summaries for a user (via Interview join)
    @Query("""
        SELECT s
        FROM InterviewSummaryEntity s
        JOIN Interview i ON i.id = s.interviewId
        WHERE i.userId = :userId
        ORDER BY s.generatedAt DESC
    """)
    List<InterviewSummaryEntity> findByUserId(Long userId);

    /* ================= ADMIN ANALYTICS ================= */

    @Query("""
        SELECT COUNT(i)
        FROM Interview i
        WHERE i.status = 'COMPLETED'
          AND (:jobRole IS NULL OR i.jobRole = :jobRole)
          AND (:fromDate IS NULL OR i.startTime >= :fromDate)
          AND (:toDate IS NULL OR i.endTime <= :toDate)
    """)
    Long countCompletedInterviews(
            String jobRole,
            LocalDateTime fromDate,
            LocalDateTime toDate
    );

    @Query("""
        SELECT AVG(s.finalScore)
        FROM InterviewSummaryEntity s
        JOIN Interview i ON i.id = s.interviewId
        WHERE i.status = 'COMPLETED'
          AND (:jobRole IS NULL OR i.jobRole = :jobRole)
          AND (:fromDate IS NULL OR i.startTime >= :fromDate)
          AND (:toDate IS NULL OR i.endTime <= :toDate)
    """)
    Double averageScore(
            String jobRole,
            LocalDateTime fromDate,
            LocalDateTime toDate
    );

    @Query("""
        SELECT u.name, s.finalScore
        FROM InterviewSummaryEntity s
        JOIN Interview i ON i.id = s.interviewId
        JOIN User u ON u.id = i.userId
        WHERE i.status = 'COMPLETED'
          AND (:jobRole IS NULL OR i.jobRole = :jobRole)
        ORDER BY s.finalScore DESC
    """)
    List<Object[]> findTopPerformer(String jobRole, Pageable pageable);

    @Query("""
        SELECT u.name, s.finalScore
        FROM InterviewSummaryEntity s
        JOIN Interview i ON i.id = s.interviewId
        JOIN User u ON u.id = i.userId
        WHERE i.status = 'COMPLETED'
          AND (:jobRole IS NULL OR i.jobRole = :jobRole)
        ORDER BY s.finalScore ASC
    """)
    List<Object[]> findLowestPerformer(String jobRole, Pageable pageable);
}
