package com.spotifyX.service;

import com.spotifyX.repository.UserRepository;
import com.spotifyX.utils.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.spotifyX.dto.LoginRequest;
import com.spotifyX.dto.RegisterRequest;
import com.spotifyX.entity.User;

@Service
public class AuthService {
  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;
  @Autowired
  private PasswordEncoder passwordEncoder;
  AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
    this.userRepository = userRepository;
    this.jwtUtil = jwtUtil;
  }
  public String register(RegisterRequest request) {
    User user = new User();
    user.setEmail(request.getEmail());
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setUsername(request.getUsername());
    // save user to db
    userRepository.saveAndFlush(user);
    return jwtUtil.generateToken(user.getEmail());

  }
  public String login(LoginRequest request) {
    User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
      return jwtUtil.generateToken(user.getEmail());
    } else {
      throw new RuntimeException("Invalid credentials");
    }
  }
}
