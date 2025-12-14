package com.genAI.eduLearn.service;

import com.genAI.eduLearn.dto.QuizAttemptRequest;
import com.genAI.eduLearn.dto.QuizResponse;
import com.genAI.eduLearn.dto.QuizResultResponse;
import com.genAI.eduLearn.dto.UserResponse;
import com.genAI.eduLearn.entity.*;
import com.genAI.eduLearn.repository.*;
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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private QuizAttemptRepository quizAttemptRepository;

    @Mock
    private RemarkRepository remarkRepository;

    @InjectMocks
    private QuizService quizService;

    @Test
    void getAllQuizzes_Success() {
        Quiz quiz = createTestQuiz();
        Page<Quiz> quizPage = new PageImpl<>(Arrays.asList(quiz));
        Pageable pageable = PageRequest.of(0, 10);

        when(quizRepository.findAll(pageable)).thenReturn(quizPage);

        Page<QuizResponse> result = quizService.getAllQuizzes(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Test Quiz", result.getContent().get(0).getTitle());
    }

    @Test
    void getQuizById_Success() {
        Quiz quiz = createTestQuiz();
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));

        QuizResponse result = quizService.getQuizById(1L);

        assertNotNull(result);
        assertEquals("Test Quiz", result.getTitle());
        assertEquals(100, result.getXpReward());
    }

    @Test
    void getQuizById_NotFound() {
        when(quizRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> quizService.getQuizById(1L));
    }

    @Test
    void submitQuizAttempt_Success() {
        User student = createTestUser();
        Quiz quiz = createTestQuiz();
        QuizAttemptRequest request = createQuizAttemptRequest();
        
        QuizAttempt savedAttempt = new QuizAttempt();
        savedAttempt.setId(1L);
        savedAttempt.setAttemptedAt(LocalDateTime.now());

        when(userRepository.findByUsername("student")).thenReturn(Optional.of(student));
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(quizAttemptRepository.existsByUserAndQuiz(student, quiz)).thenReturn(false);
        when(quizAttemptRepository.save(any(QuizAttempt.class))).thenReturn(savedAttempt);

        QuizResultResponse result = quizService.submitQuizAttempt(request, "student");

        assertNotNull(result);
        assertTrue(result.getScore() >= 0 && result.getScore() <= quiz.getTotalMarks());
        assertNotNull(result.getStatus());
        verify(userRepository).save(student);
    }

    @Test
    void submitQuizAttempt_AlreadyAttempted() {
        User student = createTestUser();
        Quiz quiz = createTestQuiz();
        QuizAttemptRequest request = createQuizAttemptRequest();

        when(userRepository.findByUsername("student")).thenReturn(Optional.of(student));
        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(quizAttemptRepository.existsByUserAndQuiz(student, quiz)).thenReturn(true);

        assertThrows(RuntimeException.class, () -> quizService.submitQuizAttempt(request, "student"));
    }

    @Test
    void getLeaderboard_Success() {
        User student = createTestUser();
        Page<User> userPage = new PageImpl<>(Arrays.asList(student));
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.findStudentsOrderByXpDesc(pageable)).thenReturn(userPage);

        Page<UserResponse> result = quizService.getLeaderboard(pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("student", result.getContent().get(0).getUsername());
    }

    @Test
    void getStudentQuizResults_Success() {
        User student = createTestUser();
        Quiz quiz = createTestQuiz();
        QuizAttempt attempt = new QuizAttempt();
        attempt.setId(1L);
        attempt.setUser(student);
        attempt.setQuiz(quiz);
        attempt.setScore(8);
        attempt.setTotalMarks(10);
        attempt.setAttemptedAt(LocalDateTime.now());

        Page<QuizAttempt> attemptPage = new PageImpl<>(Arrays.asList(attempt));
        Pageable pageable = PageRequest.of(0, 10);

        when(userRepository.findByUsername("student")).thenReturn(Optional.of(student));
        when(quizAttemptRepository.findByUserOrderByAttemptedAtDesc(student, pageable)).thenReturn(attemptPage);

        Page<QuizResultResponse> result = quizService.getStudentQuizResults("student", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals(8, result.getContent().get(0).getScore());
        assertEquals(10, result.getContent().get(0).getTotalMarks());
    }

    private Quiz createTestQuiz() {
        Quiz quiz = new Quiz();
        quiz.setId(1L);
        quiz.setTitle("Test Quiz");
        quiz.setDescription("Test Description");
        quiz.setXpReward(100);
        quiz.setTotalMarks(10);

        Question question = new Question();
        question.setId(1L);
        question.setQuestionText("Test Question");
        question.setMarks(1);

        Option option1 = new Option();
        option1.setId(1L);
        option1.setOptionText("Option 1");
        option1.setIsCorrect(true);

        Option option2 = new Option();
        option2.setId(2L);
        option2.setOptionText("Option 2");
        option2.setIsCorrect(false);

        question.setOptions(Arrays.asList(option1, option2));
        quiz.setQuestions(Arrays.asList(question));

        return quiz;
    }

    private User createTestUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("student");
        user.setEmail("student@test.com");
        user.setRole(User.Role.STUDENT);
        user.setXp(100);
        return user;
    }

    private QuizAttemptRequest createQuizAttemptRequest() {
        QuizAttemptRequest request = new QuizAttemptRequest();
        request.setQuizId(1L);

        QuizAttemptRequest.AnswerRequest answer = new QuizAttemptRequest.AnswerRequest();
        answer.setQuestionId(1L);
        answer.setSelectedOptionId(1L);

        request.setAnswers(Arrays.asList(answer));
        return request;
    }
}