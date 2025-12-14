package com.genAI.eduLearn.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.genAI.eduLearn.dto.JwtResponse;
import com.genAI.eduLearn.dto.LoginRequest;
import com.genAI.eduLearn.dto.SignupRequest;
import com.genAI.eduLearn.entity.User;
import com.genAI.eduLearn.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    void signin_Success() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password");

        JwtResponse response = new JwtResponse("jwt-token", 1L, "testuser", "test@email.com", User.Role.STUDENT, 100);

        when(authService.authenticateUser(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.role").value("STUDENT"));
    }

//    @Test
//    void signin_InvalidCredentials() throws Exception {
//        LoginRequest request = new LoginRequest();
//        request.setUsername("invalid");
//        request.setPassword("wrong");
//
//        when(authService.authenticateUser(any(LoginRequest.class)))
//                .thenThrow(new RuntimeException("Invalid credentials"));
//
//        mockMvc.perform(post("/api/auth/signin")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isBadRequest());
//    }

    @Test
    void signup_Success() throws Exception {
        SignupRequest request = new SignupRequest();
        request.setUsername("newuser");
        request.setEmail("newuser@test.com");
        request.setPassword("password");
        request.setFirstName("New");
        request.setLastName("User");
        request.setRole(User.Role.STUDENT);

        when(authService.registerUser(any(SignupRequest.class))).thenReturn("User registered successfully!");

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully!"));
    }

//    @Test
//    void signup_DuplicateUsername() throws Exception {
//        SignupRequest request = new SignupRequest();
//        request.setUsername("existing");
//        request.setEmail("test@email.com");
//        request.setPassword("password");
//        request.setFirstName("Test");
//        request.setLastName("User");
//        request.setRole(User.Role.STUDENT);
//
//        when(authService.registerUser(any(SignupRequest.class)))
//                .thenThrow(new RuntimeException("Username is already taken!"));
//
//        mockMvc.perform(post("/api/auth/signup")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isBadRequest());
//    }

    @Test
    void signin_ValidationError() throws Exception {
        LoginRequest request = new LoginRequest();
        // Empty username and password

        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signup_ValidationError() throws Exception {
        SignupRequest request = new SignupRequest();
        // Missing required fields

        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}