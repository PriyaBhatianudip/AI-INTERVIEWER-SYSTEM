package com.ai.interviewer.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "answers")
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long interviewId;
    private Long questionId;

    @Column(length = 2000, columnDefinition = "TEXT")
    private String answerText;

    // ---- AI SCORES ----
    private Double accuracyScore;
    private Double relevanceScore;
    private Double communicationScore;
    private Double overallScore;

    private String sentiment;
    private String confidence;

    // ---- AI FEEDBACK (FIXED TO LISTS) ----
    @ElementCollection
    @CollectionTable(
        name = "answer_strengths",
        joinColumns = @JoinColumn(name = "answer_id")
    )
    @Column(name = "strength")
    private List<String> strengths;

    @ElementCollection
    @CollectionTable(
        name = "answer_weaknesses",
        joinColumns = @JoinColumn(name = "answer_id")
    )
    @Column(name = "weakness")
    private List<String> weaknesses;

    @ElementCollection
    @CollectionTable(
        name = "answer_improvement_tips",
        joinColumns = @JoinColumn(name = "answer_id")
    )
    @Column(name = "improvement_tip")
    private List<String> improvementTips;

    private LocalDateTime createdAt = LocalDateTime.now();
}
