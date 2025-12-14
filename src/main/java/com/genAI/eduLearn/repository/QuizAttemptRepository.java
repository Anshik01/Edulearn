package com.genAI.eduLearn.repository;

import com.genAI.eduLearn.entity.Quiz;
import com.genAI.eduLearn.entity.QuizAttempt;
import com.genAI.eduLearn.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    Optional<QuizAttempt> findByUserAndQuiz(User user, Quiz quiz);
    boolean existsByUserAndQuiz(User user, Quiz quiz);
    Page<QuizAttempt> findByUserOrderByAttemptedAtDesc(User user, Pageable pageable);
}