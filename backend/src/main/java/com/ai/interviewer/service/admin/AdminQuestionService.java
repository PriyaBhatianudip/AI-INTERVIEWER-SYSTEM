package com.ai.interviewer.service.admin;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ai.interviewer.dto.admin.AdminQuestionRequest;
import com.ai.interviewer.dto.admin.AdminQuestionResponse;
import com.ai.interviewer.model.Question;
import com.ai.interviewer.repository.QuestionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class AdminQuestionService {

    private final QuestionRepository questionRepository;

    // Get all questions
    public List<AdminQuestionResponse> getAllQuestions() {
        return questionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Add new question
    public AdminQuestionResponse addQuestion(AdminQuestionRequest request) {

        Question question = new Question();
        question.setQuestionText(request.getQuestionText());
        question.setJobRole(request.getJobRole());
        question.setDifficulty(request.getDifficulty());
        question.setIdealAnswer(request.getIdealAnswer());
        question.setKeyPoints(request.getKeyPoints());
        question.setActive(true);
        question.setCreatedAt(LocalDateTime.now());

        Question saved = questionRepository.save(question);
        return mapToResponse(saved);
    }
    public void deleteQuestion(Long id) {

        Question question = questionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Question not found"));

        questionRepository.delete(question);
    }


    // Update question
    public AdminQuestionResponse updateQuestion(Long id, AdminQuestionRequest request) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setQuestionText(request.getQuestionText());
        question.setJobRole(request.getJobRole());
        question.setDifficulty(request.getDifficulty());
        question.setIdealAnswer(request.getIdealAnswer());
        question.setKeyPoints(request.getKeyPoints());
        question.setActive(request.isActive());  

        return mapToResponse(questionRepository.save(question));
    }

    // Activate / Deactivate
    public void updateStatus(Long id, boolean active) {

        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        question.setActive(active);
        questionRepository.save(question);
    }

    // Mapper
    private AdminQuestionResponse mapToResponse(Question q) {
        return new AdminQuestionResponse(
                q.getId(),
                q.getQuestionText(),
                q.getJobRole(),
                q.getDifficulty(),
                q.getActive(),
                q.getCreatedAt()
        );
    }
    public Page<AdminQuestionResponse> getQuestions(
            String jobRole,
            String difficulty,
            String search,
            Pageable pageable
    ) {
        return questionRepository
                .searchQuestions(jobRole, difficulty, search, pageable)
                .map(this::mapToResponse);
    }

}
