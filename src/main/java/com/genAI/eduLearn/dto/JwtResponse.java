package com.genAI.eduLearn.dto;

import com.genAI.eduLearn.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private User.Role role;
    private Integer xp;
    
    public JwtResponse(String token, Long id, String username, String email, User.Role role, Integer xp) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.xp = xp;
    }
}