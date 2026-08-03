package com.ai.interviewer.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_summary")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSummaryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "interview_id", nullable = false, unique = true)
    private Long interviewId;

    @Column(columnDefinition = "TEXT")
    private String summaryText;

    private Double finalScore;

    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        this.generatedAt = LocalDateTime.now();
    }
}
