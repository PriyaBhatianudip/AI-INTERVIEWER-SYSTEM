package com.ai.interviewer.service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ai.interviewer.dto.*;
import com.ai.interviewer.model.*;
import com.ai.interviewer.repository.*;

@Service
public class InterviewSummaryService {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AiEngineService aiEngineService;

    @Autowired
    private InterviewSummaryRepository interviewSummaryRepository;

    /* ============================================================
       ====================== COMPARE LOGIC =======================
       ============================================================ */

    public InterviewCompareDto compareLastTwoInterviews(Long userId) {

        List<InterviewSummaryEntity> summaries =
                interviewSummaryRepository.findByUserId(userId);

        if (summaries.size() < 2) {
            throw new IllegalStateException("Not enough interviews to compare");
        }

        InterviewSummaryEntity recentSummary = summaries.get(0);
        InterviewSummaryEntity previousSummary = summaries.get(1);

        Interview recentInterview =
                interviewRepository.findById(recentSummary.getInterviewId())
                        .orElseThrow();

        Interview previousInterview =
                interviewRepository.findById(previousSummary.getInterviewId())
                        .orElseThrow();

        InterviewCompareDto dto = new InterviewCompareDto();

        InterviewCompareDto.InterviewSnapshot recent =
                buildSnapshot(recentInterview);

        InterviewCompareDto.InterviewSnapshot previous =
                buildSnapshot(previousInterview);

        dto.setRecent(recent);
        dto.setPrevious(previous);

        List<String> highlights = generateHighlights(dto);
        dto.setHighlights(highlights);

        /* ================= AI COMPARISON SUMMARY ================= */

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        AiCompareRequest aiReq = new AiCompareRequest();
        aiReq.setCandidateName(user.getName());
        aiReq.setJobRole(recent.getJobRole());
        aiReq.setPreviousOverall(previous.getOverallScore());
        aiReq.setRecentOverall(recent.getOverallScore());
        aiReq.setAccuracyDiff(recent.getAccuracy() - previous.getAccuracy());
        aiReq.setRelevanceDiff(recent.getRelevance() - previous.getRelevance());
        aiReq.setCommunicationDiff(
                recent.getCommunication() - previous.getCommunication());
        aiReq.setHighlights(highlights);

        AiCompareResponse aiRes = null;
        try {
            aiRes = aiEngineService.generateComparisonSummary(aiReq);
        } catch (Exception e) {
            // fail-safe, do NOT break comparison page
        }

        if (aiRes != null) {
            dto.setAiSummary(aiRes.getComparisonSummary());
            dto.setNextStrategy(aiRes.getNextInterviewStrategy());
        } else {
            dto.setAiSummary(
                "Your recent interview shows noticeable progress compared to the previous one. " +
                "Focus on consistency and deeper explanations to continue improving."
            );
            dto.setNextStrategy(
                "Revise core concepts, practice structured answers, and attempt a mock interview " +
                "within the next 3–5 days."
            );
        }

        return dto;
    }

    private InterviewCompareDto.InterviewSnapshot buildSnapshot(Interview interview) {

        List<Answer> answers =
                answerRepository.findByInterviewId(interview.getId());

        InterviewCompareDto.InterviewSnapshot s =
                new InterviewCompareDto.InterviewSnapshot();

        s.setInterviewId(interview.getId());
        s.setJobRole(interview.getJobRole());
        s.setAccuracy(averageAccuracy(answers));
        s.setRelevance(averageRelevance(answers));
        s.setCommunication(averageCommunication(answers));
        s.setOverallScore(overallScore(answers));
        s.setDate(interview.getEndTime());

        int duration =
                (int) Duration.between(
                        interview.getStartTime(),
                        interview.getEndTime()
                ).toMinutes();

        s.setDurationMinutes(duration);

        return s;
    }

    private List<String> generateHighlights(InterviewCompareDto dto) {

        List<String> highlights = new ArrayList<>();

        if (dto.getRecent().getAccuracy() > dto.getPrevious().getAccuracy()) {
            highlights.add("Accuracy improved compared to the previous interview");
        }

        if (dto.getRecent().getRelevance() > dto.getPrevious().getRelevance()) {
            highlights.add("Answer relevance has improved");
        }

        if (dto.getRecent().getCommunication() > dto.getPrevious().getCommunication()) {
            highlights.add("Communication clarity is stronger");
        }

        if (highlights.isEmpty()) {
            highlights.add("Overall performance remained consistent");
        }

        return highlights;
    }

    /* ============================================================
       ====================== AI SUMMARY ==========================
       ============================================================ */

    public AiSummaryResponse generateAiSummary(Long interviewId) {

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        User user = userRepository.findById(interview.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Answer> answers = answerRepository.findByInterviewId(interviewId);

        double avgAccuracy = averageAccuracy(answers);
        double avgRelevance = averageRelevance(answers);
        double avgCommunication = averageCommunication(answers);
        double overallScore = overallScore(answers);

        List<Map<String, Object>> evaluations = answers.stream()
                .map(a -> Map.of(
                        "question_id", a.getQuestionId(),
                        "answer", a.getAnswerText(),
                        "overall_score", a.getOverallScore(),
                        "strengths", a.getStrengths(),
                        "weaknesses", a.getWeaknesses(),
                        "improvement_tips", a.getImprovementTips()
                ))
                .toList();

        AiSummaryRequest req = new AiSummaryRequest();
        req.setCandidate_name(user.getName());
        req.setJob_role(interview.getJobRole());
        req.setInterview_session_id(interviewId);
        req.setEvaluations(evaluations);

        AiSummaryResponse response = aiEngineService.generateSummary(req);

        InterviewSummaryEntity summaryEntity =
                interviewSummaryRepository.findByInterviewId(interviewId)
                        .orElse(new InterviewSummaryEntity());

        summaryEntity.setInterviewId(interviewId);
        summaryEntity.setFinalScore(overallScore);

        if (response.getSummary_paragraphs() != null) {
            summaryEntity.setSummaryText(
                    String.join("\n", response.getSummary_paragraphs())
            );
        }

        interviewSummaryRepository.save(summaryEntity);

        response.setAverageAccuracy(avgAccuracy);
        response.setAverageRelevance(avgRelevance);
        response.setAverageCommunication(avgCommunication);
        response.setOverallScore(overallScore);

        return response;
    }

    /* ============================================================
       ====================== REPORT DETAIL =======================
       ============================================================ */

    public InterviewReportDetailDto getInterviewReportDetail(Long interviewId) {

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        List<Answer> answers = answerRepository.findByInterviewId(interviewId);

        InterviewSummaryEntity summary =
                interviewSummaryRepository.findByInterviewId(interviewId)
                        .orElse(null);

        InterviewReportDetailDto dto = new InterviewReportDetailDto();
        dto.setInterviewId(interviewId);
        dto.setJobRole(interview.getJobRole());
        dto.setInterviewDate(interview.getEndTime());
        dto.setOverallScore(overallScore(answers));
        dto.setAccuracy(averageAccuracy(answers));
        dto.setRelevance(averageRelevance(answers));
        dto.setCommunication(averageCommunication(answers));

        dto.setStrengths(
                answers.stream()
                        .flatMap(a -> a.getStrengths() == null
                                ? java.util.stream.Stream.empty()
                                : a.getStrengths().stream())
                        .distinct()
                        .toList()
        );

        dto.setWeaknesses(
                answers.stream()
                        .flatMap(a -> a.getWeaknesses() == null
                                ? java.util.stream.Stream.empty()
                                : a.getWeaknesses().stream())
                        .distinct()
                        .toList()
        );

        dto.setImprovementAreas(
                answers.stream()
                        .flatMap(a -> a.getImprovementTips() == null
                                ? java.util.stream.Stream.empty()
                                : a.getImprovementTips().stream())
                        .distinct()
                        .toList()
        );

        dto.setSummaryText(summary != null ? summary.getSummaryText() : "");

        return dto;
    }

    /* ============================================================
       ====================== HELPERS =============================
       ============================================================ */

    public double averageAccuracy(List<Answer> answers) {
        return answers.stream()
                .mapToDouble(a -> a.getAccuracyScore() != null ? a.getAccuracyScore() : 0)
                .average().orElse(0);
    }

    public double averageRelevance(List<Answer> answers) {
        return answers.stream()
                .mapToDouble(a -> a.getRelevanceScore() != null ? a.getRelevanceScore() : 0)
                .average().orElse(0);
    }

    public double averageCommunication(List<Answer> answers) {
        return answers.stream()
                .mapToDouble(a -> a.getCommunicationScore() != null ? a.getCommunicationScore() : 0)
                .average().orElse(0);
    }

    public double overallScore(List<Answer> answers) {
        return (averageAccuracy(answers)
                + averageRelevance(answers)
                + averageCommunication(answers)) / 3;
    }
}
