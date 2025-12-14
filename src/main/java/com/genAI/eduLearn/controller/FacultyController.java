package com.genAI.eduLearn.controller;

import com.genAI.eduLearn.dto.QuizRequest;
import com.genAI.eduLearn.dto.QuizResponse;
import com.genAI.eduLearn.dto.RemarkRequest;
import com.genAI.eduLearn.dto.RemarkResponse;
import com.genAI.eduLearn.dto.UserResponse;
import com.genAI.eduLearn.entity.Quiz;
import com.genAI.eduLearn.entity.Remark;
import com.genAI.eduLearn.entity.User;
import com.genAI.eduLearn.service.QuizService;
import com.genAI.eduLearn.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class FacultyController {
    
    private final QuizService quizService;
    private final UserService userService;
    
    @PostMapping("/quizzes")
    public ResponseEntity<Quiz> createQuiz(
            @RequestBody QuizRequest request,
            Authentication authentication) {
        System.out.println("=== CREATE QUIZ REQUEST ===");
        System.out.println("User: " + authentication.getName());
        System.out.println("Request: " + request);
        try {
            Quiz quiz = quizService.createQuiz(request, authentication.getName());
            System.out.println("Quiz created successfully: " + quiz.getId());
            return ResponseEntity.ok(quiz);
        } catch (Exception e) {
            System.err.println("Error creating quiz: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/quizzes")
    public ResponseEntity<Page<QuizResponse>> getFacultyQuizzes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size);
        Page<QuizResponse> quizzes = quizService.getFacultyQuizzes(authentication.getName(), pageable);
        return ResponseEntity.ok(quizzes);
    }
    
    @DeleteMapping("/quizzes/{id}")
    public ResponseEntity<String> deleteQuiz(
            @PathVariable Long id,
            Authentication authentication) {
        quizService.deleteQuiz(id, authentication.getName());
        return ResponseEntity.ok("Quiz deleted successfully");
    }
    
    @GetMapping("/students")
    public ResponseEntity<Page<User>> getStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> students = userService.getStudents(pageable, search);
        return ResponseEntity.ok(students);
    }
    
    @PostMapping("/remarks")
    public ResponseEntity<RemarkResponse> addRemark(
            @RequestBody RemarkRequest request,
            Authentication authentication) {
        RemarkResponse remark = userService.addRemark(request, authentication.getName());
        return ResponseEntity.ok(remark);
    }
    
    @GetMapping("/remarks")
    public ResponseEntity<Page<RemarkResponse>> getFacultyRemarks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RemarkResponse> remarks = userService.getFacultyRemarks(authentication.getName(), pageable);
        return ResponseEntity.ok(remarks);
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
}