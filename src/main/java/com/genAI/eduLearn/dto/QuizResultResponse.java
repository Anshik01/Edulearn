package com.genAI.eduLearn.dto;

import lombok.Data;

@Data
public class QuizResultResponse {
    private Long attemptId;
    private String quizTitle;
    private Integer score;
    private Integer totalMarks;
    private Integer xpEarned;
    private Double percentage;
    private String status;
    private String attemptedAt;
}