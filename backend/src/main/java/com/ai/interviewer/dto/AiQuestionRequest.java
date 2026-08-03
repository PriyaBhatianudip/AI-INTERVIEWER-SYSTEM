package com.ai.interviewer.dto;

import lombok.Data;

@Data
public class AiQuestionRequest {
    private String jobRole;
    private String difficulty;
    private int count; // how many questions to generate
}
