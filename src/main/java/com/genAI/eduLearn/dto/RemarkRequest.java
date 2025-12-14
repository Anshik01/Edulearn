package com.genAI.eduLearn.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RemarkRequest {
    @NotBlank(message = "Remark text is required")
    private String remarkText;
    
    @NotNull(message = "Student ID is required")
    private Long studentId;
}