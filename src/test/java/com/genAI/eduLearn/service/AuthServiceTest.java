package com.genAI.eduLearn.service;

import com.genAI.eduLearn.dto.JwtResponse;
import com.genAI.eduLearn.dto.LoginRequest;
import com.genAI.eduLearn.dto.SignupRequest;
import com.genAI.eduLearn.entity.User;
import com.genAI.eduLearn.repository.UserRepository;
import com.genAI.eduLearn.security.JwtUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @InjectMocks
    private AuthService authService;

    @Test
    void authenticateUser_Success() {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password");

        User user = createTestUser();
        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("jwt-token");

        JwtResponse result = authService.authenticateUser(request);

        assertNotNull(result);
        assertEquals("jwt-token", result.getToken());
        assertEquals("testuser", result.getUsername());
        assertEquals(User.Role.STUDENT, result.getRole());
        assertEquals(100, result.getXp());
    }

    @Test
    void authenticateUser_UserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setUsername("nonexistent");
        request.setPassword("password");

        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> authService.authenticateUser(request));
    }

    @Test
    void registerUser_Success() {
        SignupRequest request = new SignupRequest();
        request.setUsername("newuser");
        request.setEmail("newuser@test.com");
        request.setPassword("password");
        request.setFirstName("New");
        request.setLastName("User");
        request.setRole(User.Role.STUDENT);

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("newuser@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(new User());

        String result = authService.registerUser(request);

        assertNotNull(result);
        assertEquals("User registered successfully!", result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_UsernameExists() {
        SignupRequest request = new SignupRequest();
        request.setUsername("existinguser");
        request.setEmail("new@test.com");
        request.setPassword("password");
        request.setFirstName("New");
        request.setLastName("User");
        request.setRole(User.Role.STUDENT);

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.registerUser(request));
    }

    @Test
    void registerUser_EmailExists() {
        SignupRequest request = new SignupRequest();
        request.setUsername("newuser");
        request.setEmail("existing@test.com");
        request.setPassword("password");
        request.setFirstName("New");
        request.setLastName("User");
        request.setRole(User.Role.STUDENT);

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.registerUser(request));
    }



    private User createTestUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setRole(User.Role.STUDENT);
        user.setXp(100);
        return user;
    }
}