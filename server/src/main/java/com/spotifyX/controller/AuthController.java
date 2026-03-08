package com.spotifyX.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spotifyX.dto.AuthResponse;
import com.spotifyX.dto.LoginRequest;
import com.spotifyX.dto.RegisterRequest;
import com.spotifyX.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired private AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<?> Register(@RequestBody RegisterRequest request) {
    System.out.println("Received registration request for email: " + request.getEmail() + " and username: " + request.getUsername());
    return ResponseEntity.ok(new AuthResponse(authService.register(request)));
  }
  @PostMapping("/login")
  public ResponseEntity<?> Login(@RequestBody LoginRequest request) {
    System.out.println("Received login request for email: " + request.getEmail());
    return ResponseEntity.ok(new AuthResponse(authService.login(request)));
  }
}
