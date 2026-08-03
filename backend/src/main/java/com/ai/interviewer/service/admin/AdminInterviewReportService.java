package com.ai.interviewer.service.admin;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ai.interviewer.dto.admin.InterviewReportDetailResponse;
import com.ai.interviewer.dto.admin.InterviewReportListResponse;
import com.ai.interviewer.dto.admin.InterviewReportSummaryResponse;
import com.ai.interviewer.model.Answer;
import com.ai.interviewer.model.Interview;
import com.ai.interviewer.model.User;
import com.ai.interviewer.repository.AnswerRepository;
import com.ai.interviewer.repository.InterviewRepository;
import com.ai.interviewer.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminInterviewReportService {

    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;
    private final AnswerRepository answerRepository;

    // =========================================================
    // 🔹 SUMMARY CARDS (Top section)
    // =========================================================
    public InterviewReportSummaryResponse getSummary(
            String jobRole,
            LocalDate fromDate,
            LocalDate toDate
    ) {

        LocalDateTime from = fromDate != null ? fromDate.atStartOfDay() : null;
        LocalDateTime to = toDate != null ? toDate.atTime(23, 59, 59) : null;

        List<Interview> interviews =
                interviewRepository
                        .findCompleted(jobRole, from, to, Pageable.unpaged())
                        .getContent();

        long completedCount = interviews.size();

        double totalScore = 0;
        String topCandidate = null;
        double topScore = -1;
        String lowCandidate = null;
        double lowScore = 101;

        for (Interview interview : interviews) {

            List<Answer> answers =
                    answerRepository.findByInterviewId(interview.getId());

            if (answers.isEmpty()) continue;

            double avg =
                    answers.stream()
                            .mapToDouble(a ->
                                    a.getOverallScore() != null
                                            ? a.getOverallScore()
                                            : 0
                            )
                            .average()
                            .orElse(0);

            totalScore += avg;

            User user =
                    userRepository.findById(interview.getUserId()).orElse(null);

            if (user == null) continue;

            if (avg > topScore) {
                topScore = avg;
                topCandidate = user.getName();
            }

            if (avg < lowScore) {
                lowScore = avg;
                lowCandidate = user.getName();
            }
        }

        long avgScore =
                completedCount > 0
                        ? Math.round(totalScore / completedCount)
                        : 0;

        return new InterviewReportSummaryResponse(
                completedCount,
                avgScore,
                topCandidate,
                topScore >= 0 ? topScore : null,
                lowCandidate,
                lowScore <= 100 ? lowScore : null
        );
    }

    // =========================================================
    // 🔹 INTERVIEW REPORT TABLE (ADMIN)
    // =========================================================
    public Page<InterviewReportListResponse> getReports(
            String search,
            String jobRole,
            LocalDate fromDate,
            LocalDate toDate,
            Pageable pageable,
            String role   // role is NOT used for status
    ) {

        LocalDateTime from = fromDate != null ? fromDate.atStartOfDay() : null;
        LocalDateTime to = toDate != null ? toDate.atTime(23, 59, 59) : null;

        return interviewRepository.searchReports(
                jobRole,
                search,
                from,
                to,
                pageable
        ).map(interview -> {

            User user =
                    userRepository.findById(interview.getUserId()).orElse(null);

            List<Answer> answers =
                    answerRepository.findByInterviewId(interview.getId());

            double score =
                    answers.stream()
                            .mapToDouble(a ->
                                    a.getOverallScore() != null
                                            ? a.getOverallScore()
                                            : 0
                            )
                            .average()
                            .orElse(0);

            return new InterviewReportListResponse(
                    interview.getId(),
                    user != null ? user.getName() : "Unknown",
                    interview.getJobRole(),
                    interview.getEndTime(),      // LocalDateTime ✅
                    score,                       // computed score ✅
                    interview.getStatus()        // REAL interview status ✅
            );
        });
    }

    // =========================================================
    // 🔹 VIEW REPORT (Detail Page)
    // =========================================================
    public InterviewReportDetailResponse getReportDetail(Long interviewId) {

        Interview interview =
                interviewRepository.findById(interviewId)
                        .orElseThrow(() ->
                                new RuntimeException("Interview not found"));

        User user =
                userRepository.findById(interview.getUserId())
                        .orElseThrow(() ->
                                new RuntimeException("User not found"));

        List<Answer> answers =
                answerRepository.findByInterviewId(interviewId);

        if (answers.isEmpty()) {
            throw new RuntimeException("No answers found for interview");
        }

        double avgAccuracy =
                answers.stream()
                        .mapToDouble(a ->
                                a.getAccuracyScore() != null
                                        ? a.getAccuracyScore()
                                        : 0
                        )
                        .average()
                        .orElse(0);

        double avgRelevance =
                answers.stream()
                        .mapToDouble(a ->
                                a.getRelevanceScore() != null
                                        ? a.getRelevanceScore()
                                        : 0
                        )
                        .average()
                        .orElse(0);

        double avgCommunication =
                answers.stream()
                        .mapToDouble(a ->
                                a.getCommunicationScore() != null
                                        ? a.getCommunicationScore()
                                        : 0
                        )
                        .average()
                        .orElse(0);

        double overallScore =
                (avgAccuracy + avgRelevance + avgCommunication) / 3;

        String recommendation =
                overallScore >= 75 ? "Hire"
                        : overallScore >= 55 ? "Consider"
                        : "Reject";

        return new InterviewReportDetailResponse(
                interview.getId(),
                user.getName(),
                interview.getJobRole(),
                overallScore,
                avgAccuracy,
                avgRelevance,
                avgCommunication,
                answers.stream()
                        .map(Answer::getStrengths)
                        .filter(l -> l != null)
                        .flatMap(List::stream)
                        .toList(),
                answers.stream()
                        .map(Answer::getWeaknesses)
                        .filter(l -> l != null)
                        .flatMap(List::stream)
                        .toList(),
                answers.stream()
                        .map(Answer::getImprovementTips)
                        .filter(l -> l != null)
                        .flatMap(List::stream)
                        .toList(),
                null,
                recommendation
        );
    }
}
