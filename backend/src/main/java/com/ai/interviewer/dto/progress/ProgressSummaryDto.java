package com.ai.interviewer.dto.progress;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class ProgressSummaryDto {

    private Double overallScore;
    private Long interviewsTaken;
    private LocalDate lastInterviewDate;

    /**
     * JPQL projection constructor (ONLY ONE ALLOWED)
     */
    public ProgressSummaryDto(Double overallScore,
                              Long interviewsTaken,
                              LocalDateTime lastInterviewDateTime) {
        this.overallScore = overallScore;
        this.interviewsTaken = interviewsTaken;
        this.lastInterviewDate =
                lastInterviewDateTime != null
                        ? lastInterviewDateTime.toLocalDate()
                        : null;
    }
}
