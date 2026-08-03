package com.ai.interviewer.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ai.interviewer.dto.LoginResponse;
import com.ai.interviewer.model.User;
import com.ai.interviewer.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    private static final Logger log =
        LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        log.info("📝 Register request received for email: {}", user.getEmail());
        return userService.register(user);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody User user) {

        log.info("🔥 Login API HIT for email: {}", user.getEmail());

        User loggedInUser = userService.login(
            user.getEmail(),
            user.getPassword(),
            user.getRole() != null ? user.getRole().name() : null
        );

        return new LoginResponse(
            loggedInUser.getId(),
            loggedInUser.getName(),   // 🔑 THIS FIXES GREETING
            loggedInUser.getEmail(),
            loggedInUser.getRole().name()
        );
    }
}
