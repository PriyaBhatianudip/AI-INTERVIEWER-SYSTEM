package com.ai.interviewer.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.ai.interviewer.model.Answer;
import com.ai.interviewer.repository.AnswerRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerRepository answerRepository;

    /**
     * Used by InterviewDashboard to fetch
     * accuracy, relevance, communication, confidence etc.
     */
    @GetMapping("/interview/{interviewId}")
    public List<Answer> getAnswersByInterview(@PathVariable Long interviewId) {

        System.out.println("===== FETCHING ANSWERS FOR INTERVIEW =====");
        System.out.println("Interview ID: " + interviewId);

        List<Answer> answers =
                answerRepository.findByInterviewIdWithInsights(interviewId);

        System.out.println("Total answers returned: " + answers.size());

        return answers;
    }
}
