package com.example.interview.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@Service
public class AIInterviewClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;

    public AIInterviewClient(
            RestTemplate restTemplate,
            @Value("${ai.service.base-url:http://localhost:8000}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    // ==================== Health Check ====================
    
    public Map<String, Object> healthCheck() {
        String url = baseUrl + "/health";
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        return response.getBody();
    }

    // ==================== Speech-to-Text ====================
    
    public STTResponse transcribeAudio(MultipartFile audioFile) throws IOException {
        String url = baseUrl + "/stt";
        
        // Create temp file
        Path tempFile = Files.createTempFile("audio_", audioFile.getOriginalFilename());
        audioFile.transferTo(tempFile.toFile());
        
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", new FileSystemResource(tempFile.toFile()));
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            ResponseEntity<STTResponse> response = restTemplate.postForEntity(
                    url, requestEntity, STTResponse.class);
            
            return response.getBody();
        } finally {
            Files.deleteIfExists(tempFile);
        }
    }

    // ==================== Answer Evaluation ====================
    
    public AnswerScore evaluateAnswer(AnswerEvaluationRequest request) {
        String url = baseUrl + "/evaluate-answer";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<AnswerEvaluationRequest> requestEntity = new HttpEntity<>(request, headers);
        
        ResponseEntity<AnswerScore> response = restTemplate.postForEntity(
                url, requestEntity, AnswerScore.class);
        
        return response.getBody();
    }

    // ==================== Summary Generation ====================
    
    public SummaryResponse generateSummary(SummaryRequest request) {
        String url = baseUrl + "/summary";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<SummaryRequest> requestEntity = new HttpEntity<>(request, headers);
        
        ResponseEntity<SummaryResponse> response = restTemplate.postForEntity(
                url, requestEntity, SummaryResponse.class);
        
        return response.getBody();
    }

    // ==================== Adaptive Difficulty ====================
    
    public AdaptiveResponse getNextDifficulty(AdaptiveRequest request) {
        String url = baseUrl + "/adaptive-next";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<AdaptiveRequest> requestEntity = new HttpEntity<>(request, headers);
        
        ResponseEntity<AdaptiveResponse> response = restTemplate.postForEntity(
                url, requestEntity, AdaptiveResponse.class);
        
        return response.getBody();
    }

    // ==================== DTOs ====================
    
    public static class STTResponse {
        private String text;
        
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    public static class AnswerEvaluationRequest {
        private int candidateId;
        private int interviewSessionId;
        private int questionId;
        private String jobRole;
        private String questionText;
        private String idealAnswer;
        private List<String> keyPoints;
        private String candidateAnswer;
        
        // Getters and Setters
        public int getCandidateId() { return candidateId; }
        public void setCandidateId(int candidateId) { this.candidateId = candidateId; }
        
        public int getInterviewSessionId() { return interviewSessionId; }
        public void setInterviewSessionId(int interviewSessionId) { this.interviewSessionId = interviewSessionId; }
        
        public int getQuestionId() { return questionId; }
        public void setQuestionId(int questionId) { this.questionId = questionId; }
        
        public String getJobRole() { return jobRole; }
        public void setJobRole(String jobRole) { this.jobRole = jobRole; }
        
        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }
        
        public String getIdealAnswer() { return idealAnswer; }
        public void setIdealAnswer(String idealAnswer) { this.idealAnswer = idealAnswer; }
        
        public List<String> getKeyPoints() { return keyPoints; }
        public void setKeyPoints(List<String> keyPoints) { this.keyPoints = keyPoints; }
        
        public String getCandidateAnswer() { return candidateAnswer; }
        public void setCandidateAnswer(String candidateAnswer) { this.candidateAnswer = candidateAnswer; }
    }

    public static class AnswerScore {
        private double accuracyScore;
        private double relevanceScore;
        private double communicationScore;
        private String sentiment;
        private String confidence;
        private double overallScore;
        private List<String> strengths;
        private List<String> weaknesses;
        private List<String> improvementTips;
        
        // Getters and Setters
        public double getAccuracyScore() { return accuracyScore; }
        public void setAccuracyScore(double accuracyScore) { this.accuracyScore = accuracyScore; }
        
        public double getRelevanceScore() { return relevanceScore; }
        public void setRelevanceScore(double relevanceScore) { this.relevanceScore = relevanceScore; }
        
        public double getCommunicationScore() { return communicationScore; }
        public void setCommunicationScore(double communicationScore) { this.communicationScore = communicationScore; }
        
        public String getSentiment() { return sentiment; }
        public void setSentiment(String sentiment) { this.sentiment = sentiment; }
        
        public String getConfidence() { return confidence; }
        public void setConfidence(String confidence) { this.confidence = confidence; }
        
        public double getOverallScore() { return overallScore; }
        public void setOverallScore(double overallScore) { this.overallScore = overallScore; }
        
        public List<String> getStrengths() { return strengths; }
        public void setStrengths(List<String> strengths) { this.strengths = strengths; }
        
        public List<String> getWeaknesses() { return weaknesses; }
        public void setWeaknesses(List<String> weaknesses) { this.weaknesses = weaknesses; }
        
        public List<String> getImprovementTips() { return improvementTips; }
        public void setImprovementTips(List<String> improvementTips) { this.improvementTips = improvementTips; }
    }

    public static class SummaryRequest {
        private String candidateName;
        private String jobRole;
        private int interviewSessionId;
        private List<Map<String, Object>> evaluations;
        
        // Getters and Setters
        public String getCandidateName() { return candidateName; }
        public void setCandidateName(String candidateName) { this.candidateName = candidateName; }
        
        public String getJobRole() { return jobRole; }
        public void setJobRole(String jobRole) { this.jobRole = jobRole; }
        
        public int getInterviewSessionId() { return interviewSessionId; }
        public void setInterviewSessionId(int interviewSessionId) { this.interviewSessionId = interviewSessionId; }
        
        public List<Map<String, Object>> getEvaluations() { return evaluations; }
        public void setEvaluations(List<Map<String, Object>> evaluations) { this.evaluations = evaluations; }
    }

    public static class SummaryResponse {
        private double overallRating10;
        private List<String> summaryParagraphs;
        private List<String> strengths;
        private List<String> improvementAreas;
        private List<String> learningPath;
        private String recommendation;
        private String pdfPath;
        
        // Getters and Setters
        public double getOverallRating10() { return overallRating10; }
        public void setOverallRating10(double overallRating10) { this.overallRating10 = overallRating10; }
        
        public List<String> getSummaryParagraphs() { return summaryParagraphs; }
        public void setSummaryParagraphs(List<String> summaryParagraphs) { this.summaryParagraphs = summaryParagraphs; }
        
        public List<String> getStrengths() { return strengths; }
        public void setStrengths(List<String> strengths) { this.strengths = strengths; }
        
        public List<String> getImprovementAreas() { return improvementAreas; }
        public void setImprovementAreas(List<String> improvementAreas) { this.improvementAreas = improvementAreas; }
        
        public List<String> getLearningPath() { return learningPath; }
        public void setLearningPath(List<String> learningPath) { this.learningPath = learningPath; }
        
        public String getRecommendation() { return recommendation; }
        public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
        
        public String getPdfPath() { return pdfPath; }
        public void setPdfPath(String pdfPath) { this.pdfPath = pdfPath; }
    }

    public static class AdaptiveRequest {
        private String jobRole;
        private List<Map<String, Object>> recentHistory;
        
        // Getters and Setters
        public String getJobRole() { return jobRole; }
        public void setJobRole(String jobRole) { this.jobRole = jobRole; }
        
        public List<Map<String, Object>> getRecentHistory() { return recentHistory; }
        public void setRecentHistory(List<Map<String, Object>> recentHistory) { this.recentHistory = recentHistory; }
    }

    public static class AdaptiveResponse {
        private String nextDifficulty;
        private String reason;
        
        // Getters and Setters
        public String getNextDifficulty() { return nextDifficulty; }
        public void setNextDifficulty(String nextDifficulty) { this.nextDifficulty = nextDifficulty; }
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}