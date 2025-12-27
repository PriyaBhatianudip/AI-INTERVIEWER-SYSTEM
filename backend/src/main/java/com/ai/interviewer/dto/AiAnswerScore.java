package com.ai.interviewer.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class AiAnswerScore {

    private Double accuracy_score;
    private Double relevance_score;
    private Double communication_score;

    private String sentiment;
    private String confidence;

    private Double overall_score;

    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> improvement_tips;
}
