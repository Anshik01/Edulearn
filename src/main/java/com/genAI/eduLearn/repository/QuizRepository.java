package com.genAI.eduLearn.repository;

import com.genAI.eduLearn.entity.Quiz;
import com.genAI.eduLearn.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Page<Quiz> findByCreatedBy(User createdBy, Pageable pageable);
}