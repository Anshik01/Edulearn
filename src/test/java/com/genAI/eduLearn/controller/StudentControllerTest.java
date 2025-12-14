package com.genAI.eduLearn.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.genAI.eduLearn.config.GlobalExceptionHandler;
import com.genAI.eduLearn.dto.QuizAttemptRequest;
import com.genAI.eduLearn.dto.QuizResponse;
import com.genAI.eduLearn.dto.QuizResultResponse;
import com.genAI.eduLearn.dto.UserResponse;
import com.genAI.eduLearn.entity.User;
import com.genAI.eduLearn.service.QuizService;
import com.genAI.eduLearn.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class StudentControllerTest {

    private MockMvc mockMvc;

    @Mock
    private QuizService quizService;

    @Mock
    private UserService userService;

    @Mock
    private com.genAI.eduLearn.service.GoogleAIService googleAIService;

    @InjectMocks
    private StudentController studentController;

    private ObjectMapper objectMapper;
    private Authentication mockAuth;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(studentController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("student");
        when(mockAuth.isAuthenticated()).thenReturn(true);
    }

    @Test
    void getQuizzes_Success() throws Exception {
        List<QuizResponse> quizzes = new ArrayList<>();
        QuizResponse quiz = new QuizResponse();
        quiz.setId(1L);
        quiz.setTitle("Test Quiz");
        quiz.setXpReward(100);
        quizzes.add(quiz);

        Page<QuizResponse> quizPage = new PageImpl<>(quizzes, PageRequest.of(0, 10), 1);
        when(quizService.getAllQuizzes(any())).thenReturn(quizPage);

        mockMvc.perform(get("/api/student/quizzes")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Test Quiz"))
                .andExpect(jsonPath("$.content[0].xpReward").value(100));
    }

    @Test
    void getQuizById_Success() throws Exception {
        QuizResponse quiz = new QuizResponse();
        quiz.setId(1L);
        quiz.setTitle("Test Quiz");
        quiz.setXpReward(100);

        when(quizService.getQuizById(1L)).thenReturn(quiz);

        mockMvc.perform(get("/api/student/quizzes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Quiz"))
                .andExpect(jsonPath("$.xpReward").value(100));
    }

    @Test
    void submitQuizAttempt_Success() throws Exception {
        QuizAttemptRequest request = new QuizAttemptRequest();
        request.setQuizId(1L);
        request.setAnswers(new ArrayList<>());

        QuizResultResponse result = new QuizResultResponse();
        result.setAttemptId(1L);
        result.setScore(85);
        result.setXpEarned(85);
        result.setStatus("PASSED");

        when(quizService.submitQuizAttempt(any(QuizAttemptRequest.class), eq("student")))
                .thenReturn(result);

        mockMvc.perform(post("/api/student/quiz-attempts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(authentication(mockAuth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score").value(85))
                .andExpect(jsonPath("$.status").value("PASSED"));
    }

    @Test
    void getLeaderboard_Success() throws Exception {
        List<UserResponse> users = new ArrayList<>();
        UserResponse user = new UserResponse();
        user.setId(1L);
        user.setUsername("student");
        user.setXp(500);
        users.add(user);

        Page<UserResponse> userPage = new PageImpl<>(users, PageRequest.of(0, 10), 1);
        when(quizService.getLeaderboard(any())).thenReturn(userPage);

        mockMvc.perform(get("/api/student/leaderboard")
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].username").value("student"))
                .andExpect(jsonPath("$.content[0].xp").value(500));
    }

    @Test
    void getProfile_Success() throws Exception {
        UserResponse user = new UserResponse();
        user.setId(1L);
        user.setUsername("student");
        user.setEmail("student@test.com");
        user.setRole(User.Role.STUDENT);
        user.setXp(300);

        when(userService.getUserProfile("student")).thenReturn(user);

        mockMvc.perform(get("/api/student/profile")
                .with(authentication(mockAuth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("student"))
                .andExpect(jsonPath("$.role").value("STUDENT"))
                .andExpect(jsonPath("$.xp").value(300));
    }

    @Test
    void updateProfile_Success() throws Exception {
        UserResponse updatedUser = new UserResponse();
        updatedUser.setId(1L);
        updatedUser.setUsername("student");
        updatedUser.setFirstName("Updated");
        updatedUser.setLastName("Student");

        when(userService.updateUserProfile(eq("student"), any())).thenReturn(updatedUser);

        mockMvc.perform(put("/api/student/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"firstName\":\"Updated\",\"lastName\":\"Student\"}")
                .with(authentication(mockAuth)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Updated"))
                .andExpect(jsonPath("$.lastName").value("Student"));
    }

    @Test
    void getQuizById_NotFound() throws Exception {
        when(quizService.getQuizById(999L))
                .thenThrow(new RuntimeException("Quiz not found"));

        mockMvc.perform(get("/api/student/quizzes/999"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void submitQuizAttempt_ValidationError() throws Exception {
        QuizAttemptRequest request = new QuizAttemptRequest();
        // Missing quizId

        mockMvc.perform(post("/api/student/quiz-attempts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .with(authentication(mockAuth)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.quizId").value("Quiz ID is required"));
    }
}