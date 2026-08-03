package com.ai.interviewer.repository.progress;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

import com.ai.interviewer.dto.progress.ProgressSummaryDto;
import com.ai.interviewer.dto.progress.ScoreTimelineDto;

@Repository
@RequiredArgsConstructor
public class ProgressRepositoryImpl implements ProgressRepository {

	@Autowired
    private final ProgressJpaRepository jpaRepository;

    @Override
    public ProgressSummaryDto getSummary(Long userId) {
        return jpaRepository.fetchSummary(userId);
    }

    @Override
    public List<ScoreTimelineDto> getTimeline(Long userId) {
        return jpaRepository.fetchTimeline(userId);
    }
}
