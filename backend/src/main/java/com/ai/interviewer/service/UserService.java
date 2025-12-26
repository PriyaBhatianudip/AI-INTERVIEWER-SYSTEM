package com.ai.interviewer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ai.interviewer.model.User;
import com.ai.interviewer.repository.UserRepository;

@Service
public class UserService
{
	@Autowired
	private UserRepository userRepository;
	
	public User register(User user)
	{
		return userRepository.save(user);
	}
	public User login(String email, String password)
	{
		return userRepository.findByEmail(email)
				.filter(u->u.getPassword()
						.equals(password)).
				orElseThrow(()-> 
				new RuntimeException("Invalid Credentials"));
	}
}
