package com.ai.interviewer.service.admin;

import java.util.List;

public interface AiQuestionService {
    List<String> generateQuestions(String jobRole, String difficulty, int count);
}
