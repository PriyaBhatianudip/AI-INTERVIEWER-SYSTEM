package com.ai.interviewer.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ai.interviewer.model.RoleType;
import com.ai.interviewer.model.User;

public interface UserRepository extends JpaRepository<User, Long> 
{
	Optional<User> findByEmail(String email);
	Optional<User> findById(Long id);
    long countByRole(RoleType role);

}
