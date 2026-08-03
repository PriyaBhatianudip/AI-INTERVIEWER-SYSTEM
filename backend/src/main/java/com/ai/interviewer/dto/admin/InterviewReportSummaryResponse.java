package com.ai.interviewer.dto.admin;

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
public class InterviewReportSummaryResponse {

    private Long completedInterviews;
    private Long averageScore;

    private String topPerformerName;
    private Double topScore;

    private String lowestPerformerName;
    private Double lowestScore;
}
