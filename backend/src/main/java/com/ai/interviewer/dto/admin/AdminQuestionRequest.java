package com.ai.interviewer.dto.admin;

import java.util.List;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AdminQuestionRequest {

    private String questionText;
    private String jobRole;
    private String difficulty;
    private String idealAnswer;
    private List<String> keyPoints;
    private boolean active;   

}
