package com.ai.interviewer.dto;

import java.util.List;

import lombok.Data;

@Data
public class AiCompareRequest {

    private String candidateName;
    private String jobRole;

    private double previousOverall;
    private double recentOverall;

    private double accuracyDiff;
    private double relevanceDiff;
    private double communicationDiff;

    private List<String> highlights;
}
