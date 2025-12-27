package com.ai.interviewer.model;

import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long interviewId;
    private Long questionId;

    @Column(length = 2000)
    private String answerText;

    // ---- AI SCORES ----
    private Double accuracyScore;
    private Double relevanceScore;
    private Double communicationScore;
    private Double overallScore;

    private String sentiment;
    private String confidence;

    // ---- AI FEEDBACK ----
    @ElementCollection
    private List<String> strengths;

    @ElementCollection
    private List<String> weaknesses;

    @ElementCollection
    private List<String> improvementTips;
}
