package com.ai.interviewer.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.ai.interviewer.dto.AiAnswerScore;
import com.ai.interviewer.dto.AiEvaluationRequest;
import com.ai.interviewer.dto.InterviewSummary;
import com.ai.interviewer.dto.SubmitAnswerRequest;
import com.ai.interviewer.dto.admin.InterviewReportListResponse;
import com.ai.interviewer.model.Answer;
import com.ai.interviewer.model.Interview;
import com.ai.interviewer.model.InterviewQuestion;
import com.ai.interviewer.model.InterviewStatus;
import com.ai.interviewer.model.Question;
import com.ai.interviewer.model.User;
import com.ai.interviewer.repository.AnswerRepository;
import com.ai.interviewer.repository.InterviewQuestionRepository;
import com.ai.interviewer.repository.InterviewRepository;
import com.ai.interviewer.repository.QuestionRepository;
import com.ai.interviewer.repository.UserRepository;
@Service
public class InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;

    // 👇 ADD THESE DEPENDENCIES
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private AiEngineService aiEngineService;
    
    @Autowired
    private InterviewQuestionRepository interviewQuestionRepository;


    // ---------------- EXISTING CODE (UNCHANGED) ----------------

    public Interview startInterview(Long userId, String jobRole) {
        Interview interview = new Interview();
        interview.setUserId(userId);
        interview.setJobRole(jobRole);
        interview.setStartTime(LocalDateTime.now());
        interview.setStatus(InterviewStatus.STARTED);
        return interviewRepository.save(interview);
    }

    public Interview endInterview(Long interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        interview.setStatus(InterviewStatus.COMPLETED);
        interview.setEndTime(LocalDateTime.now());

        return interviewRepository.save(interview);
    }

    // ---------------- NEW METHOD (AI INTEGRATION) ----------------

    public Answer submitAnswer(SubmitAnswerRequest request) {
    	if (request.getCandidateId() == null || request.getInterviewSessionId() == null || request.getQuestionId() == null) {
    	    throw new RuntimeException("userId, interviewId or questionId is NULL");
    	}
    	if (answerRepository.existsByInterviewIdAndQuestionId(
    	        request.getInterviewSessionId(),
    	        request.getQuestionId())) {
    	    return null; // already answered
    	}

        // 1️⃣ Fetch required data
        User user = userRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Interview interview = interviewRepository.findById(request.getInterviewSessionId())
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // 2️⃣ Build AI request (THIS IS WHERE YOUR CODE GOES)
        AiEvaluationRequest req = new AiEvaluationRequest();

        req.setCandidate_id(user.getId());
        req.setInterview_session_id(interview.getId());
        req.setQuestion_id(question.getId());

        req.setJob_role(interview.getJobRole());
        req.setQuestion_text(question.getQuestionText());
        req.setIdeal_answer(question.getIdealAnswer());
        req.setKey_points(question.getKeyPoints());

        req.setCandidate_answer(request.getCandidateAnswer());

        // 3️⃣ Call AI engine
        AiAnswerScore score = aiEngineService.evaluateAnswer(req);

        // 4️⃣ Save answer + AI result
        Answer answer = new Answer();
        answer.setInterviewId(request.getInterviewSessionId());
        answer.setQuestionId(request.getQuestionId());
        answer.setAnswerText(request.getCandidateAnswer());

        answer.setAccuracyScore(score.getAccuracy_score());
        answer.setRelevanceScore(score.getRelevance_score());
        answer.setCommunicationScore(score.getCommunication_score());
        answer.setOverallScore(score.getOverall_score());

        answer.setSentiment(score.getSentiment());
        answer.setConfidence(score.getConfidence());
        answer.setStrengths(score.getStrengths());
        answer.setWeaknesses(score.getWeaknesses());
        answer.setImprovementTips(score.getImprovement_tips());

        return answerRepository.save(answer);
    }
    
    
    public InterviewSummary generateSummary(Long interviewId) {

        List<Answer> answers = answerRepository.findByInterviewId(interviewId);

        double avgAccuracy = answers.stream()
                .mapToDouble(Answer::getAccuracyScore)
                .average().orElse(0);

        double avgRelevance = answers.stream()
                .mapToDouble(Answer::getRelevanceScore)
                .average().orElse(0);

        double avgCommunication = answers.stream()
                .mapToDouble(Answer::getCommunicationScore)
                .average().orElse(0);

        double overall = (avgAccuracy + avgRelevance + avgCommunication) / 3;

        InterviewSummary summary = new InterviewSummary();
        summary.setInterviewId(interviewId);
        summary.setOverallScore(overall);
        summary.setAverageAccuracy(avgAccuracy);
        summary.setAverageRelevance(avgRelevance);
        summary.setAverageCommunication(avgCommunication);

        summary.setFinalRecommendation(
                overall >= 75 ? "Hire" :
                overall >= 55 ? "Consider" : "Reject"
        );

        return summary;
    }
    

 // ADD THIS METHOD ONLY
    public List<InterviewReportListResponse> getUserPastInterviews(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Interview> interviews =
                interviewRepository.findUserInterviews(userId);

        return interviews.stream().map(interview -> {

            List<Answer> answers =
                    answerRepository.findByInterviewId(interview.getId());

            double score =
                    answers.stream()
                            .mapToDouble(a -> a.getOverallScore() != null ? a.getOverallScore() : 0)
                            .average()
                            .orElse(0);

            return new InterviewReportListResponse(
                    interview.getId(),
                    user.getName(),
                    interview.getJobRole(),
                    interview.getEndTime(),
                    score,
                    interview.getStatus()
            );
        }).toList();
    }
    public List<Question> getQuestionsForInterview(
            Long interviewId,
            String jobRole,
            int limit
    ) {
        return questionRepository
                .findRandomUnansweredQuestions(jobRole, interviewId)
                .stream()
                .limit(limit)
                .toList();
    }

    
    public InterviewSummary submitAllAnswers(
            Long interviewId,
            List<SubmitAnswerRequest> answers
    ) {
        for (SubmitAnswerRequest req : answers) {
            submitAnswer(req);
        }

        endInterview(interviewId);

        return generateSummary(interviewId); // 🔥 THIS WAS MISSING
    }

    
    public List<Question> prepareInterviewQuestions(
            Long interviewId,
            String jobRole,
            int count
    ) {
        List<Question> selected =
            questionRepository.findRandomQuestions(
                jobRole,
                PageRequest.of(0, count)
            );

        selected.forEach(q -> {
            interviewQuestionRepository.save(
                new InterviewQuestion(interviewId, q.getId())
            );
        });

        return selected;
    }

    public List<Question> getInterviewQuestions(Long interviewId) {
        return interviewQuestionRepository
            .findQuestionsByInterviewId(interviewId);
    }

}
