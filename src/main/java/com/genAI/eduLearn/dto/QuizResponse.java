package com.genAI.eduLearn.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuizResponse {
    private Long id;
    private String title;
    private String description;
    private Integer xpReward;
    private Integer totalMarks;
    private String createdAt;
    private List<QuestionResponse> questions;
    
    @Data
    public static class QuestionResponse {
        private Long id;
        private String questionText;
        private Integer marks;
        private List<OptionResponse> options;
    }
    
    @Data
    public static class OptionResponse {
        private Long id;
        private String optionText;
        private Boolean isCorrect;
    }
}