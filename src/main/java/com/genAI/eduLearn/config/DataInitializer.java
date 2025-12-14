package com.genAI.eduLearn.config;

import com.genAI.eduLearn.entity.User;
import com.genAI.eduLearn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default faculty user if not exists
        if (!userRepository.existsByUsername("faculty")) {
            User faculty = new User();
            faculty.setUsername("faculty");
            faculty.setEmail("faculty@edulearn.com");
            faculty.setPassword(passwordEncoder.encode("password"));
            faculty.setFirstName("John");
            faculty.setLastName("Faculty");
            faculty.setRole(User.Role.FACULTY);
            userRepository.save(faculty);
        }
        
        // Create default student user if not exists
        if (!userRepository.existsByUsername("student")) {
            User student = new User();
            student.setUsername("student");
            student.setEmail("student@edulearn.com");
            student.setPassword(passwordEncoder.encode("password"));
            student.setFirstName("Jane");
            student.setLastName("Student");
            student.setRole(User.Role.STUDENT);
            userRepository.save(student);
        }
    }
}