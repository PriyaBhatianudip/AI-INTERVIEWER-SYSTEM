package com.ai.interviewer.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "interview_questions",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"interview_id", "question_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 🔥 REQUIRED
    private Long id;

    @Column(name = "interview_id", nullable = false)
    private Long interviewId;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    // ✅ convenience constructor (THIS FIXES YOUR ERROR)
    public InterviewQuestion(Long interviewId, Long questionId) {
        this.interviewId = interviewId;
        this.questionId = questionId;
    }
}
