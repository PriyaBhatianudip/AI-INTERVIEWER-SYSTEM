package com.ai.interviewer.dto.admin;

import java.time.LocalDateTime;

import com.ai.interviewer.model.InterviewStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewReportListResponse {

    private Long interviewId;
    private String candidateName;
    private String jobRole;
    private LocalDateTime interviewDate; // endTime
    private double score;
    private InterviewStatus status;
}
