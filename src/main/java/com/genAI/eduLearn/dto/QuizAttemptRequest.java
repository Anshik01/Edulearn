package com.genAI.eduLearn.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class QuizAttemptRequest {
    @NotNull(message = "Quiz ID is required")
    private Long quizId;
    
    @Valid
    private List<AnswerRequest> answers;
    
    @Data
    public static class AnswerRequest {
        @NotNull(message = "Question ID is required")
        private Long questionId;
        
        private Long selectedOptionId;
    }
}