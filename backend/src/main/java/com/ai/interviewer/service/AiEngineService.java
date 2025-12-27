package com.ai.interviewer.service;

import com.ai.interviewer.dto.AiEvaluationRequest;
import com.ai.interviewer.dto.AiAnswerScore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiEngineService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.engine.url}")
    private String aiEngineUrl;

    public AiAnswerScore evaluateAnswer(AiEvaluationRequest request) {

        return restTemplate.postForObject(
                aiEngineUrl + "/evaluate-answer",
                request,
                AiAnswerScore.class
        );
    }
}
