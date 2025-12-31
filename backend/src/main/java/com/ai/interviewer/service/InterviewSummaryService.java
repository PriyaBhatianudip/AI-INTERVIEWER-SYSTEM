package com.ai.interviewer.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ai.interviewer.dto.AiSummaryRequest;
import com.ai.interviewer.dto.AiSummaryResponse;
import com.ai.interviewer.model.Answer;
import com.ai.interviewer.model.Interview;
import com.ai.interviewer.model.User;
import com.ai.interviewer.repository.AnswerRepository;
import com.ai.interviewer.repository.InterviewRepository;
import com.ai.interviewer.repository.UserRepository;

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

    public AiSummaryResponse generateAiSummary(Long interviewId) {

        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        User user = userRepository.findById(interview.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Answer> answers = answerRepository.findByInterviewId(interviewId);

        // Convert answers → AI expected structure
        List<Map<String, Object>> evaluations = answers.stream()
                .map(a -> Map.of(
                        "question_id", a.getQuestionId(),
                        "answer", a.getAnswerText(),
                        "overall_score", a.getOverallScore(),
                        "strengths", a.getStrengths(),
                        "weaknesses", a.getWeaknesses()
                ))
                .collect(Collectors.toList());

        AiSummaryRequest req = new AiSummaryRequest();
        req.setCandidate_name(user.getName());
        req.setJob_role(interview.getJobRole());
        req.setInterview_session_id(interviewId);
        req.setEvaluations(evaluations);

        return aiEngineService.generateSummary(req);
    }
}
