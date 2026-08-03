package com.ai.interviewer.service.progress;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ai.interviewer.dto.progress.ProgressSummaryDto;
import com.ai.interviewer.dto.progress.ScoreTimelineDto;
import com.ai.interviewer.repository.progress.ProgressRepository;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class ProgressQueryService {

	@Autowired
    private final ProgressRepository progressRepository;

    public ProgressSummaryDto getSummary(Long userId) {
        ProgressSummaryDto dto = progressRepository.getSummary(userId);
        return dto != null ? dto : new ProgressSummaryDto(0.0, 0L, null);
    }

    public List<ScoreTimelineDto> getTimeline(Long userId) {
        return progressRepository.getTimeline(userId);
    }
}
