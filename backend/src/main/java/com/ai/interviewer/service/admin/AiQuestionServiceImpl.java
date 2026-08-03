package com.ai.interviewer.service.admin;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AiQuestionServiceImpl implements AiQuestionService {

    private final WebClient.Builder webClientBuilder;

    @Value("${ai.engine.url}")
    private String aiEngineUrl;

    @Override
    public List<String> generateQuestions(String jobRole, String difficulty, int count) {

        Map<String, Object> payload = Map.of(
            "jobRole", jobRole,
            "difficulty", difficulty,
            "count", count
        );

        return webClientBuilder.build()
            .post()
            .uri(aiEngineUrl + "/ai/generate-questions")
            .bodyValue(payload)
            .retrieve()
            .bodyToFlux(String.class)
            .collectList()
            .block();
    }
}
