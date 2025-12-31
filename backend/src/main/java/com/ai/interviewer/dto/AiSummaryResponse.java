package com.ai.interviewer.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiSummaryResponse {

    private double overall_rating_10;
    private List<String> summary_paragraphs;
    private List<String> strengths;
    private List<String> improvement_areas;
    private List<String> learning_path;
    private String recommendation;
    private String pdf_path;
}
