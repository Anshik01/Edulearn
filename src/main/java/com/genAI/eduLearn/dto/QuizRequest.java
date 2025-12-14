package com.genAI.eduLearn.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class QuizRequest {
    private String title;
    private String description;
    private Integer xpReward;
    private List<QuestionRequest> questions;
    
    @Data
    public static class QuestionRequest {
        private String questionText;
        private List<OptionRequest> options;
    }
    
    @Data
    public static class OptionRequest {
        private String optionText;
        private Boolean isCorrect = false;
    }
}