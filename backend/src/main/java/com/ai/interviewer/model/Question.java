package com.ai.interviewer.model;

import java.util.List;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000)
    private String questionText;

    @Column(length = 2000)
    private String idealAnswer;

    @ElementCollection
    private List<String> keyPoints;

    private String jobRole;
    private String difficulty; // EASY / MEDIUM / HARD
}
