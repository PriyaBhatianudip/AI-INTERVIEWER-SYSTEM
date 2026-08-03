package com.ai.interviewer.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class InterviewReportDetailDto {

    private Long interviewId;
    private String jobRole;
    private LocalDateTime interviewDate;

    // Scores
    private double overallScore;
    private double accuracy;
    private double relevance;
    private double communication;

    // Lists
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> improvementAreas;

    // AI summary
    private String summaryText;

    // Optional (future)
    private String recommendation; // Hire / Consider / Reject
}
