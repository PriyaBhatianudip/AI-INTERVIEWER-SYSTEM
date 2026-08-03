package com.ai.interviewer.service.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ai.interviewer.dto.admin.AdminDashboardResponse;
import com.ai.interviewer.model.InterviewStatus;
import com.ai.interviewer.model.RoleType;
import com.ai.interviewer.repository.InterviewRepository;
import com.ai.interviewer.repository.QuestionRepository;
import com.ai.interviewer.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

	@Autowired
    private final QuestionRepository questionRepository;
	@Autowired
	private final UserRepository userRepository;
	@Autowired
    private final InterviewRepository interviewRepository;

	public AdminDashboardResponse getDashboard() {

	    long totalQuestions = questionRepository.count();

	    long activeInterviews =
	            interviewRepository.countByStatus(InterviewStatus.STARTED);

	    long registeredCandidates =
	            userRepository.countByRole(RoleType.USER);

	    long pendingReviews =
	            interviewRepository.countPendingReviews();

	    List<String> recentActivity = List.of(
	        "Dashboard loaded",
	        "Interview module active",
	        "Questions module accessed"
	    );

	    return new AdminDashboardResponse(
	        "Admin",
	        recentActivity,
	        new AdminDashboardResponse.Stats(
	            totalQuestions,
	            activeInterviews,
	            registeredCandidates,
	            pendingReviews
	        )
	    );
	}
}
