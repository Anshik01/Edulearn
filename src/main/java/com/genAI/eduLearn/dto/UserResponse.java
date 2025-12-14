package com.genAI.eduLearn.dto;

import com.genAI.eduLearn.entity.User;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private User.Role role;
    private Integer xp;
}