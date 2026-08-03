package com.ai.interviewer.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.interviewer.dto.InterviewCompareDto;
import com.ai.interviewer.dto.InterviewReportDetailDto;
import com.ai.interviewer.model.Interview;
import com.ai.interviewer.model.InterviewSummaryEntity;
import com.ai.interviewer.repository.InterviewRepository;
import com.ai.interviewer.repository.InterviewSummaryRepository;
import com.ai.interviewer.service.InterviewSummaryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user/reports")
@RequiredArgsConstructor
public class UserInterviewReportController {

	@Autowired
    private final InterviewSummaryRepository summaryRepository;
	
	@Autowired
    private final InterviewRepository interviewRepository;
	
	@Autowired	
    private final InterviewSummaryService interviewSummaryService;

    /* ================= ALL REPORTS ================= */
    @GetMapping
    public List<Map<String, Object>> getUserReports(
            @RequestParam Long userId
    ) {
        List<InterviewSummaryEntity> summaries =
                summaryRepository.findByUserId(userId);

        return summaries.stream().map(s -> {
            Interview interview = interviewRepository
                    .findById(s.getInterviewId())
                    .orElse(null);

            Map<String, Object> map = new HashMap<>();
            map.put("interviewId", s.getInterviewId());
            map.put("jobRole", interview != null ? interview.getJobRole() : "N/A");
            map.put("finalScore", s.getFinalScore());
            map.put("generatedAt", s.getGeneratedAt());
            map.put("summaryText", s.getSummaryText());

            return map;
        }).toList();
    }

    /* ================= SINGLE REPORT ================= */
    @GetMapping("/{interviewId:\\d+}")
    public InterviewReportDetailDto getInterviewReportDetail(
            @PathVariable Long interviewId
    ) {
        return interviewSummaryService.getInterviewReportDetail(interviewId);
    }

    /* ================= COMPARE INTERVIEWS ================= */
    @GetMapping("/compare")
    public Map<String, Object> compareLastTwo(@RequestParam Long userId) {

        InterviewCompareDto dto =
                interviewSummaryService.compareLastTwoInterviews(userId);

        Map<String, Object> result = new HashMap<>();

        result.put("previous", dto.getPrevious());
        result.put("recent", dto.getRecent());
        result.put("highlights", dto.getHighlights());

        result.put("accuracyDiff",
                dto.getRecent().getAccuracy() - dto.getPrevious().getAccuracy());

        result.put("relevanceDiff",
                dto.getRecent().getRelevance() - dto.getPrevious().getRelevance());

        result.put("communicationDiff",
                dto.getRecent().getCommunication() - dto.getPrevious().getCommunication());

        result.put("overallDiff",
                dto.getRecent().getOverallScore() - dto.getPrevious().getOverallScore());

        // Optional AI summary (safe)
        result.put(
            "aiComparisonSummary",
            "Your recent interview shows measurable changes compared to the previous one. "
            + "Focus on sustaining strengths while addressing declining areas."
        );

        return result;
    }

    /* ================= HELPER ================= */
    private double safeDiff(Double recent, Double previous) {
        if (recent == null) recent = 0.0;
        if (previous == null) previous = 0.0;
        return recent - previous;
    }
}
