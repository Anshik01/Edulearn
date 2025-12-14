package com.genAI.eduLearn.controller;

import com.genAI.eduLearn.dto.JwtResponse;
import com.genAI.eduLearn.dto.LoginRequest;
import com.genAI.eduLearn.dto.SignupRequest;
import com.genAI.eduLearn.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        String message = authService.registerUser(signupRequest);
        return ResponseEntity.ok(message);
    }
}