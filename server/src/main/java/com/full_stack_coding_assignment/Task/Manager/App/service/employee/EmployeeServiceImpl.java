package com.full_stack_coding_assignment.Task.Manager.App.service.employee;

import com.full_stack_coding_assignment.Task.Manager.App.dto.TaskDto;
import com.full_stack_coding_assignment.Task.Manager.App.entity.Task;
import com.full_stack_coding_assignment.Task.Manager.App.entity.User;
import com.full_stack_coding_assignment.Task.Manager.App.enums.TaskStatus;
import com.full_stack_coding_assignment.Task.Manager.App.mapper.TaskMapper;
import com.full_stack_coding_assignment.Task.Manager.App.repository.TaskRepository;
import com.full_stack_coding_assignment.Task.Manager.App.util.JwtUtil;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);
    private final TaskRepository taskRepository;
    private final JwtUtil jwtUtil;
    private final TaskMapper taskMapper;

    @Override
    public List<TaskDto> getTasksByUserId() {
        User user = jwtUtil.getLoggedInUser();
        if (user != null) {
            return taskRepository.findAllByUserIdSorted(user.getId())
                    .stream()
                    .map(taskMapper::toTaskDto)
                    .collect(Collectors.toList());
        }
        throw new EntityNotFoundException("User not found!");
    }

    @Override
    public TaskDto updateTask(Long id, String status) {
        logger.info("Updating task with ID: {} to status: {}", id, status);

        // Validate and convert the status string to TaskStatus enum
        TaskStatus taskStatus;
        try {
            taskStatus = TaskStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid task status provided: {}", status);
            throw new IllegalArgumentException("Invalid task status: " + status);
        }

        // Get the logged-in user
        User user = jwtUtil.getLoggedInUser();
        if (user == null) {
            logger.error("No logged-in user found while updating task with ID: {}", id);
            throw new EntityNotFoundException("User not found!");
        }

        // Find the task by ID
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            logger.error("Task with ID {} not found", id);
            throw new EntityNotFoundException("Task not found!");
        }

        Task existingTask = optionalTask.get();

        // Verify that the task belongs to the logged-in user
        if (!existingTask.getUser().getId().equals(user.getId())) {
            logger.error("User {} is not authorized to update task with ID {}", user.getId(), id);
            throw new SecurityException("You are not authorized to update this task!");
        }

        // Update the task status
        existingTask.setTaskStatus(taskStatus);
        Task updatedTask = taskRepository.save(existingTask);
        logger.info("Task with ID {} updated successfully to status: {}", id, taskStatus);

        return taskMapper.toTaskDto(updatedTask);
    }
}