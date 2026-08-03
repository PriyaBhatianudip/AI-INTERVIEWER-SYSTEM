package com.ai.interviewer.dto;

import java.util.List;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiSummaryRequest {

    private String candidate_name;
    private String job_role;
    private Long interview_session_id;
    private List<Map<String, Object>> evaluations;
}
