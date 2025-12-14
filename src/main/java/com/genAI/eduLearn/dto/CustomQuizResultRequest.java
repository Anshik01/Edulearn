package com.genAI.eduLearn.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CustomQuizResultRequest {
    @NotNull(message = "Score is required")
    @Min(value = 0, message = "Score must be at least 0")
    @Max(value = 100, message = "Score must be at most 100")
    private Integer score;
    
    @NotNull(message = "XP earned is required")
    @Min(value = 0, message = "XP earned must be at least 0")
    private Integer xpEarned;
}