package com.genAI.eduLearn.controller;

import com.genAI.eduLearn.dto.CustomQuizRequest;
import com.genAI.eduLearn.dto.CustomQuizResultRequest;
import com.genAI.eduLearn.dto.QuizAttemptRequest;
import com.genAI.eduLearn.dto.QuizResponse;
import com.genAI.eduLearn.dto.QuizResultResponse;
import com.genAI.eduLearn.dto.RemarkResponse;
import com.genAI.eduLearn.dto.UserResponse;
import com.genAI.eduLearn.entity.*;
import com.genAI.eduLearn.service.GoogleAIService;
import com.genAI.eduLearn.service.QuizService;
import com.genAI.eduLearn.service.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class StudentController {
    
    private final QuizService quizService;
    private final UserService userService;
    private final GoogleAIService googleAIService;
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Student endpoint working");
    }
    
    @GetMapping("/quizzes")
    public ResponseEntity<Page<QuizResponse>> getQuizzes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        System.out.println("=== STUDENT GET QUIZZES ===");
        System.out.println("Page: " + page + ", Size: " + size);
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<QuizResponse> quizzes = quizService.getAllQuizzes(pageable);
            System.out.println("Found " + quizzes.getTotalElements() + " quizzes");
            return ResponseEntity.ok(quizzes);
        } catch (Exception e) {
            System.err.println("Error getting quizzes: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/quizzes/{id}")
    public ResponseEntity<QuizResponse> getQuizById(@PathVariable Long id) {
        QuizResponse quiz = quizService.getQuizById(id);
        return ResponseEntity.ok(quiz);
    }
    
    @PostMapping("/quiz-attempts")
    public ResponseEntity<QuizResultResponse> submitQuizAttempt(
            @RequestBody QuizAttemptRequest request,
            Authentication authentication) {
        QuizResultResponse result = quizService.submitQuizAttempt(request, authentication.getName());
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/leaderboard")
    public ResponseEntity<Page<UserResponse>> getLeaderboard(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        System.out.println("=== STUDENT GET LEADERBOARD ===");
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<UserResponse> leaderboard = quizService.getLeaderboard(pageable);
            System.out.println("Found " + leaderboard.getTotalElements() + " students");
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            System.err.println("Error getting leaderboard: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(Authentication authentication) {
        UserResponse user = userService.getUserProfile(authentication.getName());
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @RequestBody User updatedUser,
            Authentication authentication) {
        UserResponse user = userService.updateUserProfile(authentication.getName(), updatedUser);
        return ResponseEntity.ok(user);
    }
    
    @GetMapping("/remarks")
    public ResponseEntity<Page<RemarkResponse>> getRemarks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RemarkResponse> remarks = userService.getStudentRemarks(authentication.getName(), pageable);
        return ResponseEntity.ok(remarks);
    }
    
    @GetMapping("/quiz-results")
    public ResponseEntity<Page<QuizResultResponse>> getQuizResults(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size);
        Page<QuizResultResponse> results = quizService.getStudentQuizResults(authentication.getName(), pageable);
        return ResponseEntity.ok(results);
    }
    
    @PostMapping("/custom-quiz")
    public ResponseEntity<?> generateCustomQuiz(
            @Valid @RequestBody CustomQuizRequest request) {
        System.out.println("=== CUSTOM QUIZ REQUEST ===");
        System.out.println("Topic: " + request.getTopic());
        System.out.println("Difficulty: " + request.getDifficulty());
        
        try {
            QuizResponse quiz = googleAIService.generateCustomQuiz(request.getTopic(), request.getDifficulty());
            System.out.println("Quiz generated successfully");
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            System.err.println("Error in custom quiz endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to generate quiz", "message", e.getMessage()));
        }
    }
    
    @PostMapping("/test-custom-quiz")
    public ResponseEntity<QuizResponse> testCustomQuiz(
            @Valid @RequestBody CustomQuizRequest request) {
        System.out.println("=== TEST CUSTOM QUIZ REQUEST ===");
        System.out.println("Topic: " + request.getTopic());
        System.out.println("Difficulty: " + request.getDifficulty());
        
        // Create a mock quiz for testing
        QuizResponse quiz = new QuizResponse();
        quiz.setId(-1L);
        quiz.setTitle("Test Custom Quiz: " + request.getTopic());
        quiz.setDescription("Test " + request.getDifficulty().toLowerCase() + " level quiz on " + request.getTopic());
        quiz.setXpReward(100);
        quiz.setTotalMarks(2);
        
        List<QuizResponse.QuestionResponse> questions = new ArrayList<>();
        
        // Question 1
        QuizResponse.QuestionResponse q1 = new QuizResponse.QuestionResponse();
        q1.setId(1L);
        q1.setQuestionText("Test question 1 about " + request.getTopic());
        q1.setMarks(1);
        
        List<QuizResponse.OptionResponse> options1 = new ArrayList<>();
        QuizResponse.OptionResponse opt1 = new QuizResponse.OptionResponse();
        opt1.setId(1L);
        opt1.setOptionText("Option A");
        opt1.setIsCorrect(true);
        options1.add(opt1);
        
        QuizResponse.OptionResponse opt2 = new QuizResponse.OptionResponse();
        opt2.setId(2L);
        opt2.setOptionText("Option B");
        opt2.setIsCorrect(false);
        options1.add(opt2);
        
        q1.setOptions(options1);
        questions.add(q1);
        
        // Question 2
        QuizResponse.QuestionResponse q2 = new QuizResponse.QuestionResponse();
        q2.setId(2L);
        q2.setQuestionText("Test question 2 about " + request.getTopic());
        q2.setMarks(1);
        
        List<QuizResponse.OptionResponse> options2 = new ArrayList<>();
        QuizResponse.OptionResponse opt3 = new QuizResponse.OptionResponse();
        opt3.setId(3L);
        opt3.setOptionText("Option C");
        opt3.setIsCorrect(false);
        options2.add(opt3);
        
        QuizResponse.OptionResponse opt4 = new QuizResponse.OptionResponse();
        opt4.setId(4L);
        opt4.setOptionText("Option D");
        opt4.setIsCorrect(true);
        options2.add(opt4);
        
        q2.setOptions(options2);
        questions.add(q2);
        
        quiz.setQuestions(questions);
        
        System.out.println("Test quiz created successfully");
        return ResponseEntity.ok(quiz);
    }
    
    @PostMapping("/custom-quiz-complete")
    public ResponseEntity<UserResponse> completeCustomQuiz(
            @Valid @RequestBody CustomQuizResultRequest request,
            Authentication authentication) {
        System.out.println("=== CUSTOM QUIZ COMPLETION ===");
        System.out.println("Score: " + request.getScore());
        System.out.println("XP Earned: " + request.getXpEarned());
        System.out.println("User: " + authentication.getName());
        
        try {
            UserResponse updatedUser = userService.addCustomQuizXP(authentication.getName(), request.getXpEarned());
            System.out.println("XP added successfully. New total: " + updatedUser.getXp());
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            System.err.println("Error completing custom quiz: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                .body(null);
        }
    }
}