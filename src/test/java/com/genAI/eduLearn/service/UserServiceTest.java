package com.genAI.eduLearn.service;

import com.genAI.eduLearn.dto.RemarkRequest;
import com.genAI.eduLearn.dto.RemarkResponse;
import com.genAI.eduLearn.dto.UserResponse;
import com.genAI.eduLearn.entity.Remark;
import com.genAI.eduLearn.entity.User;
import com.genAI.eduLearn.repository.RemarkRepository;
import com.genAI.eduLearn.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RemarkRepository remarkRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void getUserProfile_Success() {
        User user = createTestUser();
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        UserResponse result = userService.getUserProfile("testuser");

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        assertEquals(100, result.getXp());
    }

    @Test
    void getUserProfile_UserNotFound() {
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserProfile("nonexistent"));
    }

    @Test
    void updateUserProfile_Success() {
        User existingUser = createTestUser();
        User updatedUser = new User();
        updatedUser.setFirstName("UpdatedFirst");
        updatedUser.setLastName("UpdatedLast");
        updatedUser.setEmail("updated@example.com");
        updatedUser.setPhone("9876543210");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        UserResponse result = userService.updateUserProfile("testuser", updatedUser);

        assertNotNull(result);
        assertEquals("UpdatedFirst", result.getFirstName());
        assertEquals("UpdatedLast", result.getLastName());
        assertEquals("updated@example.com", result.getEmail());
        assertEquals("9876543210", result.getPhone());
    }

    @Test
    void addCustomQuizXP_Success() {
        User student = createTestUser();
        student.setRole(User.Role.STUDENT);
        student.setXp(50);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(student));
        when(userRepository.save(any(User.class))).thenReturn(student);

        UserResponse result = userService.addCustomQuizXP("testuser", 30);

        assertNotNull(result);
        assertEquals(80, result.getXp());
        verify(userRepository).save(student);
    }

    @Test
    void addCustomQuizXP_UserNotFound() {
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.addCustomQuizXP("nonexistent", 50));
    }

    @Test
    void addCustomQuizXP_NotStudent() {
        User faculty = createTestUser();
        faculty.setRole(User.Role.FACULTY);

        when(userRepository.findByUsername("faculty")).thenReturn(Optional.of(faculty));

        assertThrows(RuntimeException.class, () -> userService.addCustomQuizXP("faculty", 50));
    }

    @Test
    void addRemark_Success() {
        User faculty = createTestUser();
        faculty.setRole(User.Role.FACULTY);
        User student = createTestUser();
        student.setId(2L);
        student.setRole(User.Role.STUDENT);

        RemarkRequest request = new RemarkRequest();
        request.setStudentId(2L);
        request.setRemarkText("Good work!");

        Remark savedRemark = new Remark();
        savedRemark.setId(1L);
        savedRemark.setRemarkText("Good work!");
        savedRemark.setStudent(student);
        savedRemark.setFaculty(faculty);
        savedRemark.setCreatedAt(LocalDateTime.now());

        when(userRepository.findByUsername("faculty")).thenReturn(Optional.of(faculty));
        when(userRepository.findById(2L)).thenReturn(Optional.of(student));
        when(remarkRepository.save(any(Remark.class))).thenReturn(savedRemark);

        RemarkResponse result = userService.addRemark(request, "faculty");

        assertNotNull(result);
        assertEquals("Good work!", result.getRemarkText());
        assertNotNull(result.getStudent());
        assertNotNull(result.getFaculty());
    }

    @Test
    void getStudentRemarks_Success() {
        User student = createTestUser();
        Remark remark = new Remark();
        remark.setId(1L);
        remark.setRemarkText("Test remark");
        remark.setStudent(student);
        remark.setFaculty(student);
        remark.setCreatedAt(LocalDateTime.now());

        Page<Remark> remarkPage = new PageImpl<>(Arrays.asList(remark));
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(student));
        when(remarkRepository.findByStudent(student, pageable)).thenReturn(remarkPage);

        Page<RemarkResponse> result = userService.getStudentRemarks("testuser", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Test remark", result.getContent().get(0).getRemarkText());
    }

    @Test
    void getStudents_WithSearch() {
        User student = createTestUser();
        Page<User> userPage = new PageImpl<>(Arrays.asList(student));
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.findStudentsBySearch("test", pageable)).thenReturn(userPage);

        Page<User> result = userService.getStudents(pageable, "test");

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(userRepository).findStudentsBySearch("test", pageable);
    }

    @Test
    void getStudents_WithoutSearch() {
        User student = createTestUser();
        Page<User> userPage = new PageImpl<>(Arrays.asList(student));
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.findStudentsOrderByXpDesc(pageable)).thenReturn(userPage);

        Page<User> result = userService.getStudents(pageable, null);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(userRepository).findStudentsOrderByXpDesc(pageable);
    }

    private User createTestUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setPhone("1234567890");
        user.setRole(User.Role.STUDENT);
        user.setXp(100);
        return user;
    }
}