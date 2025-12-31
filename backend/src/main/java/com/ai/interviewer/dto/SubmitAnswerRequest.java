package com.ai.interviewer.dto;

import java.util.List;
import jakarta.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SubmitAnswerRequest {

    @JsonProperty("candidate_id")
    @NotNull
    private Long candidateId;

    @JsonProperty("interview_session_id")
    private Long interviewSessionId;

    @JsonProperty("question_id")
    private Long questionId;

    @JsonProperty("job_role")
    private String jobRole;

    @JsonProperty("question_text")
    private String questionText;

    @JsonProperty("ideal_answer")
    private String idealAnswer;

    @JsonProperty("key_points")
    private List<String> keyPoints;

    @JsonProperty("candidate_answer")
    private String candidateAnswer;
}	