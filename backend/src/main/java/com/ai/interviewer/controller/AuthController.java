package com.ai.interviewer.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ai.interviewer.model.User;
import com.ai.interviewer.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	private UserService userService;
	
	@PostMapping("/register")
	public User register(@RequestBody User user)
	{
		return userService.register(user);
	}
	
	@PostMapping("/login")
	public User login(@RequestBody User user)
	{
		return userService.login(user.getEmail(), user.getPassword());
	}
}
