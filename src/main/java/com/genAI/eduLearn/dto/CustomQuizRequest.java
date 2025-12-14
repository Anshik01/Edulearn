package com.genAI.eduLearn.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CustomQuizRequest {
    @NotBlank(message = "Topic is required")
    private String topic;
    
    @NotNull(message = "Difficulty level is required")
    private String difficulty; // EASY, MEDIUM, HARD
}