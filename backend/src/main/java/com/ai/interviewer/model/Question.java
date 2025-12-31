package com.ai.interviewer.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="questions")
@ToString
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000, columnDefinition = "TEXT")
    private String questionText;

    @Column(length = 1000, columnDefinition = "TEXT")
    private String idealAnswer;

    @ElementCollection
    @CollectionTable(name="question_key_points", joinColumns=@JoinColumn(name="question_id"))
    @Column(name="key_point")
    private List<String> keyPoints;

    private String jobRole;
    private String difficulty; // EASY / MEDIUM / HARD
    private Boolean active=true;
    private LocalDateTime createdAt=LocalDateTime.now();
}
