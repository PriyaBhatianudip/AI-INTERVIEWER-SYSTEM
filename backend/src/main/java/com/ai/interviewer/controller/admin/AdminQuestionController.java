package com.ai.interviewer.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ai.interviewer.dto.AiQuestionRequest;
import com.ai.interviewer.dto.admin.AdminQuestionRequest;
import com.ai.interviewer.dto.admin.AdminQuestionResponse;
import com.ai.interviewer.service.admin.AdminQuestionService;
import com.ai.interviewer.service.admin.AiQuestionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/questions")
@RequiredArgsConstructor
public class AdminQuestionController {

	@Autowired
    private final AdminQuestionService adminQuestionService;
	@Autowired
    private final AiQuestionService aiQuestionService;

	// 🤖 AI – Generate questions by job role
	@PostMapping("/generate")
	public ResponseEntity<List<String>> generateWithAi(
	        @RequestBody AiQuestionRequest request) {

	    List<String> questions =
	        aiQuestionService.generateQuestions(
	            request.getJobRole(),
	            request.getDifficulty(),
	            request.getCount()
	        );

	    return ResponseEntity.ok(questions);
	}

    // View all questions
    @GetMapping
    public ResponseEntity<Page<AdminQuestionResponse>> getQuestions(
            @RequestParam(required = false) String jobRole,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
    	System.out.println("Getting questions...");
        return ResponseEntity.ok(
                adminQuestionService.getQuestions(
                        jobRole,
                        difficulty,
                        search,
                        PageRequest.of(page, size)
                )
        );
    }


    // Add question
    @PostMapping
    public ResponseEntity<AdminQuestionResponse> add(
            @RequestBody AdminQuestionRequest request) {
        return ResponseEntity.ok(adminQuestionService.addQuestion(request));
    }

    // Update question
    @PutMapping("/{id}")
    public ResponseEntity<AdminQuestionResponse> update(
            @PathVariable Long id,
            @RequestBody AdminQuestionRequest request) {
        return ResponseEntity.ok(adminQuestionService.updateQuestion(id, request));
    }

    // Activate / Deactivate
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam boolean active) {
        adminQuestionService.updateStatus(id, active);
        return ResponseEntity.ok("Status updated");
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        adminQuestionService.deleteQuestion(id);
        return ResponseEntity.noContent().build(); // 204
    }

}
