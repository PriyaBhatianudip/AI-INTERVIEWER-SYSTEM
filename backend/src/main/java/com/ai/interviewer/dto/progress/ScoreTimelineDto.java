package com.ai.interviewer.dto.progress;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ScoreTimelineDto {

    private LocalDate date;
    private Double score;

    public ScoreTimelineDto(LocalDateTime endTime, Double score) {
        this.date = endTime != null ? endTime.toLocalDate() : null;
        this.score = score;
    }
}
