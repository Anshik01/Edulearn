package com.genAI.eduLearn.service;

import com.genAI.eduLearn.dto.RemarkRequest;
import com.genAI.eduLearn.dto.RemarkResponse;
import com.genAI.eduLearn.dto.UserResponse;
import com.genAI.eduLearn.entity.Remark;
import com.genAI.eduLearn.entity.User;
import com.genAI.eduLearn.repository.RemarkRepository;
import com.genAI.eduLearn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final RemarkRepository remarkRepository;
    
    public UserResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToUserResponse(user);
    }
    
    public UserResponse updateUserProfile(String username, User updatedUser) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());
        user.setPhone(updatedUser.getPhone());
        
        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }
    
    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setXp(user.getXp());
        return response;
    }
    
    public Page<User> getStudents(Pageable pageable, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return userRepository.findStudentsBySearch(search.trim(), pageable);
        }
        return userRepository.findStudentsOrderByXpDesc(pageable);
    }
    
    public RemarkResponse addRemark(RemarkRequest request, String facultyUsername) {
        User faculty = userRepository.findByUsername(facultyUsername)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        User student = userRepository.findById(request.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        if (student.getRole() != User.Role.STUDENT) {
            throw new RuntimeException("Can only add remarks for students");
        }
        
        Remark remark = new Remark();
        remark.setRemarkText(request.getRemarkText());
        remark.setStudent(student);
        remark.setFaculty(faculty);
        
        Remark savedRemark = remarkRepository.save(remark);
        return convertToRemarkResponse(savedRemark);
    }
    
    public Page<RemarkResponse> getStudentRemarks(String username, Pageable pageable) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Page<Remark> remarks = remarkRepository.findByStudent(student, pageable);
        List<RemarkResponse> remarkResponses = remarks.getContent().stream()
                .map(this::convertToRemarkResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(remarkResponses, pageable, remarks.getTotalElements());
    }
    
    public Page<RemarkResponse> getFacultyRemarks(String username, Pageable pageable) {
        User faculty = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        Page<Remark> remarks = remarkRepository.findByFaculty(faculty, pageable);
        List<RemarkResponse> remarkResponses = remarks.getContent().stream()
                .map(this::convertToRemarkResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(remarkResponses, pageable, remarks.getTotalElements());
    }
    
    private RemarkResponse convertToRemarkResponse(Remark remark) {
        RemarkResponse response = new RemarkResponse();
        response.setId(remark.getId());
        response.setRemarkText(remark.getRemarkText());
        response.setCreatedAt(remark.getCreatedAt().toString());
        
        UserResponse studentResponse = new UserResponse();
        studentResponse.setId(remark.getStudent().getId());
        studentResponse.setUsername(remark.getStudent().getUsername());
        studentResponse.setFirstName(remark.getStudent().getFirstName());
        studentResponse.setLastName(remark.getStudent().getLastName());
        studentResponse.setEmail(remark.getStudent().getEmail());
        response.setStudent(studentResponse);
        
        UserResponse facultyResponse = new UserResponse();
        facultyResponse.setId(remark.getFaculty().getId());
        facultyResponse.setUsername(remark.getFaculty().getUsername());
        facultyResponse.setFirstName(remark.getFaculty().getFirstName());
        facultyResponse.setLastName(remark.getFaculty().getLastName());
        facultyResponse.setEmail(remark.getFaculty().getEmail());
        response.setFaculty(facultyResponse);
        
        return response;
    }
    
    public UserResponse addCustomQuizXP(String username, Integer xpToAdd) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != User.Role.STUDENT) {
            throw new RuntimeException("Only students can earn XP from quizzes");
        }
        
        Integer currentXp = user.getXp() != null ? user.getXp() : 0;
        user.setXp(currentXp + xpToAdd);
        
        User savedUser = userRepository.save(user);
        System.out.println("Updated user XP: " + savedUser.getXp());
        
        return convertToUserResponse(savedUser);
    }
}