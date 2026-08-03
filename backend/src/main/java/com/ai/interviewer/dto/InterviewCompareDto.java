package com.ai.interviewer.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class InterviewCompareDto {

    private InterviewSnapshot previous;
    private InterviewSnapshot recent;

    private List<String> highlights;

    // 🔥 NEW (AI-powered)
    private String aiSummary;
    private String nextStrategy;

    @Data
    public static class InterviewSnapshot {
        private Long interviewId;
        private String jobRole;

        private double accuracy;
        private double relevance;
        private double communication;
        private double overallScore;

        private LocalDateTime date;
        private int durationMinutes;
    }
}
