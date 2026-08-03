package com.ai.interviewer.controller.admin;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.interviewer.dto.admin.InterviewReportDetailResponse;
import com.ai.interviewer.dto.admin.InterviewReportListResponse;
import com.ai.interviewer.dto.admin.InterviewReportSummaryResponse;
import com.ai.interviewer.service.admin.AdminInterviewReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/interview-reports")
@RequiredArgsConstructor
public class AdminInterviewReportController {

	@Autowired
    private final AdminInterviewReportService reportService;

    // 🔹 SUMMARY CARDS
    @GetMapping("/summary")
    public ResponseEntity<InterviewReportSummaryResponse> getSummary(
            @RequestParam(required = false) String jobRole,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate
    ) {
        return ResponseEntity.ok(
                reportService.getSummary(jobRole, fromDate, toDate)
        );
    }

    // 🔹 INTERVIEW LIST (TABLE)
    @GetMapping
    public ResponseEntity<Page<InterviewReportListResponse>> getReports(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String jobRole,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<InterviewReportListResponse> reports =
                reportService.getReports(
                        jobRole,
                        search,
                        fromDate,
                        toDate,
                        PageRequest.of(page, size),
                        "ADMIN"
                );

        return ResponseEntity.ok(reports);
    }

    // 🔹 VIEW REPORT
    @GetMapping("/{interviewId}")
    public ResponseEntity<InterviewReportDetailResponse> getReportDetail(
            @PathVariable Long interviewId
    ) {
        return ResponseEntity.ok(
                reportService.getReportDetail(interviewId)
        );
    }
}
