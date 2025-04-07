package com.full_stack_coding_assignment.Task.Manager.App.repository;

import com.full_stack_coding_assignment.Task.Manager.App.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTaskId(Long taskId);
}