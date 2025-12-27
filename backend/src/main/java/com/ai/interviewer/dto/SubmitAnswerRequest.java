package com.ai.interviewer.dto;


import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmitAnswerRequest {

    private Long userId;
    private Long interviewId;
    private Long questionId;
    private String candidateAnswer;
}
