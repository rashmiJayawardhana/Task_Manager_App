package com.full_stack_coding_assignment.Task.Manager.App.repository;

import com.full_stack_coding_assignment.Task.Manager.App.entity.User;
import com.full_stack_coding_assignment.Task.Manager.App.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findFirstByUsername(String username);
    Optional<User> findByUserRole(UserRole userRole);
}
