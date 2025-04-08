package com.full_stack_coding_assignment.Task.Manager.App.service.employee;

import com.full_stack_coding_assignment.Task.Manager.App.dto.CommentDto;
import com.full_stack_coding_assignment.Task.Manager.App.dto.TaskDto;
import com.full_stack_coding_assignment.Task.Manager.App.entity.Comment;
import com.full_stack_coding_assignment.Task.Manager.App.entity.Task;
import com.full_stack_coding_assignment.Task.Manager.App.entity.User;
import com.full_stack_coding_assignment.Task.Manager.App.enums.TaskStatus;
import com.full_stack_coding_assignment.Task.Manager.App.exception.TaskNotFoundException;
import com.full_stack_coding_assignment.Task.Manager.App.exception.UnauthorizedException;
import com.full_stack_coding_assignment.Task.Manager.App.exception.UserNotFoundException;
import com.full_stack_coding_assignment.Task.Manager.App.mapper.CommentMapper;
import com.full_stack_coding_assignment.Task.Manager.App.mapper.TaskMapper;
import com.full_stack_coding_assignment.Task.Manager.App.repository.CommentRepository;
import com.full_stack_coding_assignment.Task.Manager.App.repository.TaskRepository;
import com.full_stack_coding_assignment.Task.Manager.App.repository.UserRepository;
import com.full_stack_coding_assignment.Task.Manager.App.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeServiceImpl.class);
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final JwtUtil jwtUtil;
    private final TaskMapper taskMapper;

    @Override
    public List<TaskDto> getTasksByUserId() {
        User user = jwtUtil.getLoggedInUser();
        if (user == null) {
            logger.error("No logged-in user found while fetching tasks");
            throw new UserNotFoundException("User not found");
        }
        return taskRepository.findAllByUserIdSorted(user.getId())
                .stream()
                .map(taskMapper::toTaskDto)
                .collect(Collectors.toList());
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
            throw new UserNotFoundException("User not found");
        }

        // Find the task by ID
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            logger.error("Task with ID {} not found", id);
            throw new TaskNotFoundException("Task with ID " + id + " not found");
        }

        Task existingTask = optionalTask.get();

        // Verify that the task belongs to the logged-in user
        if (!existingTask.getUser().getId().equals(user.getId())) {
            logger.error("User {} is not authorized to update task with ID {}", user.getId(), id);
            throw new UnauthorizedException("You are not authorized to update this task");
        }

        // Update the task status
        existingTask.setTaskStatus(taskStatus);
        Task updatedTask = taskRepository.save(existingTask);
        logger.info("Task with ID {} updated successfully to status: {}", id, taskStatus);

        return taskMapper.toTaskDto(updatedTask);
    }

    @Override
    public void updateUserProfileImage(Long userId, String imageName) {
        logger.info("Updating profile image for user ID: {}", userId);
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            logger.error("User with ID {} not found while updating profile image", userId);
            throw new UserNotFoundException("User with ID " + userId + " not found");
        }

        User user = optionalUser.get();
        User loggedInUser = jwtUtil.getLoggedInUser();
        if (loggedInUser == null || !loggedInUser.getId().equals(userId)) {
            logger.error("Unauthorized attempt to update profile image for user ID: {}", userId);
            throw new IllegalArgumentException("Unauthorized to update this user's profile image");
        }

        user.setProfileImage(imageName);
        userRepository.save(user);
        logger.info("Profile image updated for user ID: {}", userId);
    }

    @Override
    public TaskDto getTaskById(Long id) {
        logger.info("Fetching task with ID: {}", id);
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            logger.error("Task with ID {} not found while fetching", id);
            throw new TaskNotFoundException("Task with ID " + id + " not found");
        }
        return taskMapper.toTaskDto(optionalTask.get());
    }

    @Override
    public CommentDto createComment(Long taskId, String content) {
        if (content == null || content.trim().isEmpty()) {
            logger.error("Comment content cannot be empty for task ID: {}", taskId);
            throw new IllegalArgumentException("Comment content cannot be empty");
        }

        Optional<Task> optionalTask = taskRepository.findById(taskId);
        User user = jwtUtil.getLoggedInUser();
        if (optionalTask.isEmpty()) {
            logger.error("Task with ID {} not found while creating comment", taskId);
            throw new TaskNotFoundException("Task with ID " + taskId + " not found");
        }
        if (user == null) {
            logger.error("No logged-in user found while creating comment for task ID: {}", taskId);
            throw new UserNotFoundException("User not found");
        }

        Comment comment = new Comment();
        comment.setCreatedAt(new Date());
        comment.setContent(content);
        comment.setTask(optionalTask.get());
        comment.setUser(user);
        Comment savedComment = commentRepository.save(comment);
        return commentMapper.toCommentDto(savedComment);
    }

    @Override
    public List<CommentDto> getCommentsByTaskId(Long taskId) {
        logger.info("Fetching comments for task ID: {}", taskId);
        Optional<Task> optionalTask = taskRepository.findById(taskId);
        if (optionalTask.isEmpty()) {
            logger.error("Task with ID {} not found while fetching comments", taskId);
            throw new TaskNotFoundException("Task with ID " + taskId + " not found");
        }
        return commentRepository.findByTaskId(taskId)
                .stream()
                .sorted(Comparator.comparing(Comment::getCreatedAt).reversed())
                .map(commentMapper::toCommentDto)
                .collect(Collectors.toList());
    }
}