package com.genAI.eduLearn.dto;

import lombok.Data;

@Data
public class RemarkResponse {
    private Long id;
    private String remarkText;
    private String createdAt;
    private UserResponse student;
    private UserResponse faculty;
}