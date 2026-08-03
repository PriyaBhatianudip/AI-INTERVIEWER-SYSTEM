package com.ai.interviewer.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ai.interviewer.dto.*;

@Service
public class AiEngineService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.engine.url:http://localhost:8000}")
    private String aiEngineUrl;

    public AiAnswerScore evaluateAnswer(AiEvaluationRequest request) {
        try {
            return restTemplate.postForObject(
                    aiEngineUrl + "/evaluate-answer",
                    request,
                    AiAnswerScore.class
            );
        } catch (Exception e) {
            throw new RuntimeException("AI Engine is down or returned errors", e);
        }
    }

    public AiSummaryResponse generateSummary(AiSummaryRequest request) {
        return restTemplate.postForObject(
                aiEngineUrl + "/summary",
                request,
                AiSummaryResponse.class
        );
    }

    /** ✅ NEW: Comparison summary */
    public AiCompareResponse generateComparisonSummary(AiCompareRequest request) {
        return restTemplate.postForObject(
                aiEngineUrl + "/compare-summary",
                request,
                AiCompareResponse.class
        );
    }
}
