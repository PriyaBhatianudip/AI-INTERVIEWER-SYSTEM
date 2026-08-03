package com.ai.interviewer.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class InterviewSummary {

    private Long interviewId;
    private Long userId;

    // Scores
    private Double overallScore;        // 0 – 100
    private Double averageAccuracy;
    private Double averageRelevance;
    private Double averageCommunication;

    // AI Insights
    private List<String> strengths;
    private List<String> improvementAreas;
    private String finalRecommendation; // "Hire", "Consider", "Reject"

    // Optional
    private String summaryText;         // Natural language summary
}
