package com.example.interview.controller;

import com.example.interview.client.AIInterviewClient;
import com.example.interview.client.AIInterviewClient.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    private final AIInterviewClient aiClient;

    public InterviewController(AIInterviewClient aiClient) {
        this.aiClient = aiClient;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> health = aiClient.healthCheck();
        return ResponseEntity.ok(health);
    }

    @PostMapping("/transcribe")
    public ResponseEntity<STTResponse> transcribeAudio(
            @RequestParam("file") MultipartFile file) throws IOException {
        STTResponse response = aiClient.transcribeAudio(file);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/evaluate")
    public ResponseEntity<AnswerScore> evaluateAnswer(
            @RequestBody AnswerEvaluationRequest request) {
        AnswerScore score = aiClient.evaluateAnswer(request);
        return ResponseEntity.ok(score);
    }

    @PostMapping("/summary")
    public ResponseEntity<SummaryResponse> generateSummary(
            @RequestBody SummaryRequest request) {
        SummaryResponse summary = aiClient.generateSummary(request);
        return ResponseEntity.ok(summary);
    }

    @PostMapping("/adaptive-difficulty")
    public ResponseEntity<AdaptiveResponse> getNextDifficulty(
            @RequestBody AdaptiveRequest request) {
        AdaptiveResponse response = aiClient.getNextDifficulty(request);
        return ResponseEntity.ok(response);
    }
}
