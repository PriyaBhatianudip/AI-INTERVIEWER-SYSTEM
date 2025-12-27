package com.ai.interviewer.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AiEvaluationRequest 
{
	private Long candidate_id;
    private Long interview_session_id;
    private Long question_id;

    private String job_role;
    private String question_text;
    private String ideal_answer;

    private List<String> key_points;

    private String candidate_answer;
}
