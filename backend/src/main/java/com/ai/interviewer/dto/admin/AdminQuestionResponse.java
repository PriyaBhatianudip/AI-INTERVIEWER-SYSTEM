package com.ai.interviewer.dto.admin;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminQuestionResponse {

    private Long id;
    private String questionText;
    private String jobRole;
    private String difficulty;
    private boolean active;
    private LocalDateTime createdAt;
}
