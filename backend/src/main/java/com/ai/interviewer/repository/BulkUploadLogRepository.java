package com.ai.interviewer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ai.interviewer.model.BulkUploadLog;

@Repository
public interface BulkUploadLogRepository
        extends JpaRepository<BulkUploadLog, Long> {
}
