package com.ai.interviewer.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name="interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;        // candidate_id
    private String jobRole;     // used by AI

    private LocalDateTime startTime;
    private LocalDateTime endTime;
   
    @Enumerated(EnumType.STRING)
    private InterviewStatus status;


}
