package com.ai.interviewer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ai.interviewer.model.User;
import com.ai.interviewer.model.RoleType;
import com.ai.interviewer.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        System.out.println("user : "+user);
        return userRepository.save(user);
    }

    public User login(String email, String password, String requestedRole) {

        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // ❗ TEMP (acceptable for now, but note below)
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        // 🔐 ROLE VALIDATION (IMPORTANT)
        if (requestedRole != null && !requestedRole.isBlank()) {
            try {
                RoleType roleIntent =
                    RoleType.valueOf(requestedRole.toUpperCase());

                if (user.getRole() != roleIntent) {
                    throw new RuntimeException("Role mismatch");
                }
            } catch (IllegalArgumentException ex) {
                throw new RuntimeException("Invalid role");
            }
        }

        return user;
    }
}
