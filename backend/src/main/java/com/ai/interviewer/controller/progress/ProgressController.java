package com.ai.interviewer.controller.progress;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.interviewer.dto.progress.ProgressSummaryDto;
import com.ai.interviewer.dto.progress.ScoreTimelineDto;
import com.ai.interviewer.service.progress.ProgressQueryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

	@Autowired
    private final ProgressQueryService progressService;

    @GetMapping("/summary")
    public ProgressSummaryDto summary(@RequestParam Long userId) {
        return progressService.getSummary(userId);
    }

    @GetMapping("/timeline")
    public List<ScoreTimelineDto> timeline(@RequestParam Long userId) {
        return progressService.getTimeline(userId);
    }
}
