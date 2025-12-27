package com.ai.interviewer.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;        // candidate_id
    private String jobRole;     // used by AI

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String status;      // STARTED / COMPLETED
}
