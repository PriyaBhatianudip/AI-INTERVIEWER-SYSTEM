package com.ai.interviewer.service;

import com.ai.interviewer.dto.AiEvaluationRequest;
import com.ai.interviewer.dto.AiSummaryRequest;
import com.ai.interviewer.dto.AiSummaryResponse;
import com.ai.interviewer.dto.AiAnswerScore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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
    	}catch(Exception e)
    	{
    			throw new RuntimeException("AI Engine is down or returned errors");
    	}
    }
    
    public AiSummaryResponse generateSummary(AiSummaryRequest request) {

        return restTemplate.postForObject(
                aiEngineUrl + "/summary",
                request,
                AiSummaryResponse.class
        );
    }

}
