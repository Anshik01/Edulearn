package com.genAI.eduLearn.service;

import com.genAI.eduLearn.dto.QuizAttemptRequest;
import com.genAI.eduLearn.dto.QuizRequest;
import com.genAI.eduLearn.dto.QuizResponse;
import com.genAI.eduLearn.dto.QuizResultResponse;
import com.genAI.eduLearn.dto.UserResponse;
import com.genAI.eduLearn.entity.*;
import com.genAI.eduLearn.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {
    
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final RemarkRepository remarkRepository;
    
    @Transactional
    public Quiz createQuiz(QuizRequest request, String username) {
        User faculty = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setXpReward(request.getXpReward() != null ? request.getXpReward() : 100);
        quiz.setCreatedBy(faculty);
        
        List<Question> questions = new ArrayList<>();
        int totalMarks = 0;
        
        if (request.getQuestions() != null) {
            for (QuizRequest.QuestionRequest qReq : request.getQuestions()) {
                Question question = new Question();
                question.setQuestionText(qReq.getQuestionText());
                question.setMarks(1);
                question.setQuiz(quiz);
                
                totalMarks += 1;
                
                List<Option> options = new ArrayList<>();
                if (qReq.getOptions() != null) {
                    for (QuizRequest.OptionRequest oReq : qReq.getOptions()) {
                        Option option = new Option();
                        option.setOptionText(oReq.getOptionText());
                        option.setIsCorrect(oReq.getIsCorrect() != null ? oReq.getIsCorrect() : false);
                        option.setQuestion(question);
                        options.add(option);
                    }
                }
                question.setOptions(options);
                questions.add(question);
            }
        }
        
        quiz.setTotalMarks(totalMarks);
        quiz.setQuestions(questions);
        
        return quizRepository.save(quiz);
    }
    
    public Page<QuizResponse> getAllQuizzes(Pageable pageable) {
        Page<Quiz> quizzes = quizRepository.findAll(pageable);
        List<QuizResponse> quizResponses = quizzes.getContent().stream()
                .map(this::convertToQuizResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(quizResponses, pageable, quizzes.getTotalElements());
    }
    
    private QuizResponse convertToQuizResponse(Quiz quiz) {
        QuizResponse response = new QuizResponse();
        response.setId(quiz.getId());
        response.setTitle(quiz.getTitle());
        response.setDescription(quiz.getDescription());
        response.setXpReward(quiz.getXpReward());
        response.setTotalMarks(quiz.getTotalMarks());
        response.setCreatedAt(quiz.getCreatedAt() != null ? quiz.getCreatedAt().toString() : null);
        
        if (quiz.getQuestions() != null) {
            List<QuizResponse.QuestionResponse> questions = quiz.getQuestions().stream()
                    .map(this::convertToQuestionResponse)
                    .collect(Collectors.toList());
            response.setQuestions(questions);
        }
        
        return response;
    }
    
    private QuizResponse.QuestionResponse convertToQuestionResponse(Question question) {
        QuizResponse.QuestionResponse response = new QuizResponse.QuestionResponse();
        response.setId(question.getId());
        response.setQuestionText(question.getQuestionText());
        response.setMarks(question.getMarks());
        
        if (question.getOptions() != null) {
            List<QuizResponse.OptionResponse> options = question.getOptions().stream()
                    .map(this::convertToOptionResponse)
                    .collect(Collectors.toList());
            response.setOptions(options);
        }
        
        return response;
    }
    
    private QuizResponse.OptionResponse convertToOptionResponse(Option option) {
        QuizResponse.OptionResponse response = new QuizResponse.OptionResponse();
        response.setId(option.getId());
        response.setOptionText(option.getOptionText());
        response.setIsCorrect(option.getIsCorrect());
        return response;
    }
    
    public Page<QuizResponse> getFacultyQuizzes(String username, Pageable pageable) {
        User faculty = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        Page<Quiz> quizzes = quizRepository.findByCreatedBy(faculty, pageable);
        List<QuizResponse> quizResponses = quizzes.getContent().stream()
                .map(this::convertToQuizResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(quizResponses, pageable, quizzes.getTotalElements());
    }
    
    public QuizResponse getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        return convertToQuizResponse(quiz);
    }
    
    @Transactional
    public QuizResultResponse submitQuizAttempt(QuizAttemptRequest request, String username) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        if (quizAttemptRepository.existsByUserAndQuiz(student, quiz)) {
            throw new RuntimeException("Quiz already attempted");
        }
        
        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(student);
        attempt.setQuiz(quiz);
        attempt.setTotalMarks(quiz.getTotalMarks());
        
        List<Answer> answers = new ArrayList<>();
        int totalScore = 0;
        
        for (QuizAttemptRequest.AnswerRequest ansReq : request.getAnswers()) {
            Question question = quiz.getQuestions().stream()
                    .filter(q -> q.getId().equals(ansReq.getQuestionId()))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Question not found"));
            
            Answer answer = new Answer();
            answer.setQuizAttempt(attempt);
            answer.setQuestion(question);
            
            if (ansReq.getSelectedOptionId() != null) {
                Option selectedOption = question.getOptions().stream()
                        .filter(o -> o.getId().equals(ansReq.getSelectedOptionId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Option not found"));
                
                answer.setSelectedOption(selectedOption);
                answer.setIsCorrect(selectedOption.getIsCorrect());
                
                if (selectedOption.getIsCorrect()) {
                    answer.setMarksObtained(question.getMarks());
                    totalScore += question.getMarks();
                }
            }
            
            answers.add(answer);
        }
        
        attempt.setAnswers(answers);
        attempt.setScore(totalScore);
        
        // Calculate results
        double percentage = (double) totalScore / quiz.getTotalMarks() * 100;
        int xpEarned = (int) (quiz.getXpReward() * (percentage / 100));
        
        // Update student XP
        student.setXp(student.getXp() + xpEarned);
        userRepository.save(student);
        
        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);
        
        // Create result response
        QuizResultResponse result = new QuizResultResponse();
        result.setAttemptId(savedAttempt.getId());
        result.setQuizTitle(quiz.getTitle());
        result.setScore(totalScore);
        result.setTotalMarks(quiz.getTotalMarks());
        result.setXpEarned(xpEarned);
        result.setPercentage(percentage);
        result.setStatus(percentage >= 60 ? "PASSED" : "FAILED");
        result.setAttemptedAt(savedAttempt.getAttemptedAt().toString());
        
        return result;
    }
    
    public void deleteQuiz(Long id, String username) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        User faculty = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        if (!quiz.getCreatedBy().getId().equals(faculty.getId())) {
            throw new RuntimeException("Unauthorized to delete this quiz");
        }
        
        quizRepository.delete(quiz);
    }
    
    public Page<UserResponse> getLeaderboard(Pageable pageable) {
        Page<User> users = userRepository.findStudentsOrderByXpDesc(pageable);
        List<UserResponse> userResponses = users.getContent().stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(userResponses, pageable, users.getTotalElements());
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
    
    public Page<QuizResultResponse> getStudentQuizResults(String username, Pageable pageable) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Page<QuizAttempt> attempts = quizAttemptRepository.findByUserOrderByAttemptedAtDesc(student, pageable);
        List<QuizResultResponse> results = attempts.getContent().stream()
                .map(this::convertToQuizResultResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(results, pageable, attempts.getTotalElements());
    }
    
    private QuizResultResponse convertToQuizResultResponse(QuizAttempt attempt) {
        QuizResultResponse result = new QuizResultResponse();
        result.setAttemptId(attempt.getId());
        result.setQuizTitle(attempt.getQuiz().getTitle());
        result.setScore(attempt.getScore());
        result.setTotalMarks(attempt.getTotalMarks());
        
        double percentage = (double) attempt.getScore() / attempt.getTotalMarks() * 100;
        result.setPercentage(percentage);
        result.setXpEarned((int) (attempt.getQuiz().getXpReward() * (percentage / 100)));
        result.setStatus(percentage >= 60 ? "PASSED" : "FAILED");
        result.setAttemptedAt(attempt.getAttemptedAt().toString());
        
        return result;
    }
}