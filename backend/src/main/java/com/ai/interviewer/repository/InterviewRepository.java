package com.ai.interviewer.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ai.interviewer.model.Interview;
import com.ai.interviewer.model.InterviewStatus;
import com.ai.interviewer.model.InterviewSummaryEntity;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
	@Query("""
		    SELECT s
		    FROM InterviewSummaryEntity s
		    WHERE s.interviewId IN (
		        SELECT i.id FROM Interview i WHERE i.userId = :userId
		    )
		    ORDER BY s.generatedAt DESC
		""")
		List<InterviewSummaryEntity> findByUserId(@Param("userId") Long userId);

    // 🔹 Search interview reports (Admin)
    @Query("""
        SELECT i FROM Interview i
        JOIN User u ON u.id = i.userId
        WHERE i.status = 'COMPLETED'
          AND (:jobRole IS NULL OR i.jobRole = :jobRole)
          AND (:search IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')))
          AND (:fromDate IS NULL OR i.startTime >= :fromDate)
          AND (:toDate IS NULL OR i.endTime <= :toDate)
        ORDER BY i.endTime DESC
    """)
    Page<Interview> searchReports(
            @Param("jobRole") String jobRole,
            @Param("search") String search,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate,
            Pageable pageable
    );

    // 🔹 Completed interviews (Reusable)
    @Query("""
        SELECT i FROM Interview i
        WHERE i.status = 'COMPLETED'
          AND (:jobRole IS NULL OR i.jobRole = :jobRole)
          AND (:from IS NULL OR i.startTime >= :from)
          AND (:to IS NULL OR i.endTime <= :to)
    """)
    Page<Interview> findCompleted(
            @Param("jobRole") String jobRole,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable
    );
    @Query("""
    	    SELECT COUNT(i)
    	    FROM Interview i
    	    WHERE i.status = 'COMPLETED'
    	      AND (:jobRole IS NULL OR i.jobRole = :jobRole)
    	      AND (:from IS NULL OR i.startTime >= :from)
    	      AND (:to IS NULL OR i.endTime <= :to)
    	""")
    	Long countCompleted(
    	    String jobRole,
    	    LocalDateTime from,
    	    LocalDateTime to
    	);
    @Query("""
    	    SELECT i
    	    FROM Interview i
    	    WHERE i.userId = :userId
    	    ORDER BY i.endTime DESC
    	""")
    	List<Interview> findUserInterviews(
    	        @Param("userId") Long userId
    	);
    long countByStatus(InterviewStatus status);

    @Query("""
    	    SELECT COUNT(i)
    	    FROM Interview i
    	    WHERE i.status = 'COMPLETED'
    	""")
    	long countPendingReviews();
}
