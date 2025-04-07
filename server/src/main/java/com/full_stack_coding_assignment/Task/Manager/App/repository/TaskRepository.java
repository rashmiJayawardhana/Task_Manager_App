package com.full_stack_coding_assignment.Task.Manager.App.repository;

import com.full_stack_coding_assignment.Task.Manager.App.dto.TaskDto;
import com.full_stack_coding_assignment.Task.Manager.App.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long>{
    List<Task> findAllByTitleContaining(String title);

    void findAllByUserId(Long id);

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId " +
            "ORDER BY CASE t.priority " +
            "WHEN 'HIGH' THEN 3 " +
            "WHEN 'MEDIUM' THEN 2 " +
            "WHEN 'LOW' THEN 1 " +
            "ELSE 0 END DESC, " +
            "CASE t.taskStatus " +
            "WHEN 'INPROGRESS' THEN 5 " +
            "WHEN 'PENDING' THEN 4 " +
            "WHEN 'DEFERRED' THEN 3 " +
            "WHEN 'CANCELLED' THEN 2 " +
            "WHEN 'COMPLETED' THEN 1 " +
            "ELSE 0 END DESC, " +
            "t.dueDate ASC")
    List<Task> findAllByUserIdSorted(Long userId);
}
