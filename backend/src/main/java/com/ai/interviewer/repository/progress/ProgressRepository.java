package com.ai.interviewer.repository.progress;

import java.util.List;

import com.ai.interviewer.dto.progress.ProgressSummaryDto;
import com.ai.interviewer.dto.progress.ScoreTimelineDto;

public interface ProgressRepository {
    ProgressSummaryDto getSummary(Long userId);
    List<ScoreTimelineDto> getTimeline(Long userId);
}
