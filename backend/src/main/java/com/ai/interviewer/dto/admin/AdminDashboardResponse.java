package com.ai.interviewer.dto.admin;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDashboardResponse {

    private String adminName;
    private List<String> recentActivity;
    private Stats stats;

    @Data
    @AllArgsConstructor
    public static class Stats {
        private long totalQuestions;
        private long activeInterviews;
        private long registeredCandidates;
        private long pendingReviews;
    }
}
