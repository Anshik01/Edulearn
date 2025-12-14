package com.genAI.eduLearn.repository;

import com.genAI.eduLearn.entity.Remark;
import com.genAI.eduLearn.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RemarkRepository extends JpaRepository<Remark, Long> {
    Page<Remark> findByStudent(User student, Pageable pageable);
    Page<Remark> findByFaculty(User faculty, Pageable pageable);
}