package com.ai.interviewer.dto;

import lombok.Data;

@Data
public class AiCompareResponse {

    private String comparisonSummary;      // AI-written comparison
    private String nextInterviewStrategy;   // AI next-step guidance
}
