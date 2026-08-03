package com.ai.interviewer.dto.admin;

import java.util.List;

import com.ai.interviewer.dto.InterviewSummary;
import com.ai.interviewer.model.Answer;
import com.ai.interviewer.model.Interview;
import com.ai.interviewer.model.User;

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
public class InterviewReportDetailResponse {

    private Long interviewId;
    private String candidateName;
    private String jobRole;

    private Double overallScore;
    private Double averageAccuracy;
    private Double averageRelevance;
    private Double averageCommunication;

    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> improvementTips;

    private String summaryText;
    private String finalRecommendation;

    // =====================================================
    // ✅ FACTORY METHOD (USED BY SERVICE)
    // =====================================================
    public static InterviewReportDetailResponse from(
            Interview interview,
            User user,
            InterviewSummary summary,
            List<Answer> answers
    ) {
        double avgAccuracy = answers.stream()
                .mapToDouble(a -> a.getAccuracyScore() != null ? a.getAccuracyScore() : 0)
                .average()
                .orElse(0);

        double avgRelevance = answers.stream()
                .mapToDouble(a -> a.getRelevanceScore() != null ? a.getRelevanceScore() : 0)
                .average()
                .orElse(0);

        double avgCommunication = answers.stream()
                .mapToDouble(a -> a.getCommunicationScore() != null ? a.getCommunicationScore() : 0)
                .average()
                .orElse(0);

        double overall = (avgAccuracy + avgRelevance + avgCommunication) / 3;

        return new InterviewReportDetailResponse(
                interview.getId(),
                user.getName(),
                interview.getJobRole(),
                summary != null ? summary.getOverallScore() : overall,
                avgAccuracy,
                avgRelevance,
                avgCommunication,
                summary != null ? summary.getStrengths() : List.of(),
                summary != null ? summary.getImprovementAreas() : List.of(),
                summary != null ? summary.getImprovementAreas() : List.of(),
                summary != null ? summary.getSummaryText() : null,
                summary != null ? summary.getFinalRecommendation() : null
        );
    }
}
