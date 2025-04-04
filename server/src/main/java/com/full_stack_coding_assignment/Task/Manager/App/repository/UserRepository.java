package com.full_stack_coding_assignment.Task.Manager.App.repository;

import com.full_stack_coding_assignment.Task.Manager.App.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
