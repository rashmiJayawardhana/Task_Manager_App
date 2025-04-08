package com.full_stack_coding_assignment.Task.Manager.App.service.admin;

import com.full_stack_coding_assignment.Task.Manager.App.dto.CommentDto;
import com.full_stack_coding_assignment.Task.Manager.App.dto.TaskDto;
import com.full_stack_coding_assignment.Task.Manager.App.dto.UserDto;
import com.full_stack_coding_assignment.Task.Manager.App.entity.Comment;
import com.full_stack_coding_assignment.Task.Manager.App.entity.Task;
import com.full_stack_coding_assignment.Task.Manager.App.entity.User;
import com.full_stack_coding_assignment.Task.Manager.App.enums.TaskStatus;
import com.full_stack_coding_assignment.Task.Manager.App.enums.UserRole;
import com.full_stack_coding_assignment.Task.Manager.App.exception.TaskNotFoundException;
import com.full_stack_coding_assignment.Task.Manager.App.exception.UserNotFoundException;
import com.full_stack_coding_assignment.Task.Manager.App.mapper.CommentMapper;
import com.full_stack_coding_assignment.Task.Manager.App.mapper.TaskMapper;
import com.full_stack_coding_assignment.Task.Manager.App.mapper.UserMapper;
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
public class AdminServiceImpl implements AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final CommentRepository commentRepository;
    private final TaskMapper taskMapper;
    private final UserMapper userMapper;
    private final CommentMapper commentMapper;

    @Override
    public TaskDto createTask(TaskDto taskDto) {
        logger.info("Creating task for employee ID: {}", taskDto.getEmployeeId());
        Optional<User> optionalUser = userRepository.findById(taskDto.getEmployeeId());
        if (optionalUser.isEmpty()) {
            logger.error("Employee with ID {} not found while creating task", taskDto.getEmployeeId());
            throw new UserNotFoundException("Employee with ID " + taskDto.getEmployeeId() + " not found");
        }

        Task task = taskMapper.toTask(taskDto);
        task.setTaskStatus(taskDto.getTaskStatus() != null ? taskDto.getTaskStatus() : TaskStatus.INPROGRESS);
        task.setUser(optionalUser.get());
        Task savedTask = taskRepository.save(task);
        logger.info("Task created with ID: {}", savedTask.getId());
        return taskMapper.toTaskDto(savedTask);
    }

    @Override
    public List<UserDto> getUsers() {
        logger.info("Fetching all users with role EMPLOYEE");
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getUserRole() == UserRole.EMPLOYEE)
                .map(userMapper::toUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskDto> getAllTasks() {
        logger.info("Fetching all tasks for employees");
        return taskRepository.findAll()
                .stream()
                .filter(task -> task.getUser().getUserRole() == UserRole.EMPLOYEE)
                .sorted(Comparator.comparing(Task::getDueDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(taskMapper::toTaskDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTask(Long id) {
        logger.info("Deleting task with ID: {}", id);
        if (!taskRepository.existsById(id)) {
            logger.error("Task with ID {} not found while deleting", id);
            throw new TaskNotFoundException("Task with ID " + id + " not found");
        }
        taskRepository.deleteById(id);
        logger.info("Task with ID {} deleted successfully", id);
    }

    @Override
    public TaskDto updateTask(Long id, TaskDto taskDto) {
        logger.info("Updating task with ID: {}", id);
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            logger.error("Task with ID {} not found while updating", id);
            throw new TaskNotFoundException("Task with ID " + id + " not found");
        }

        Optional<User> optionalUser = userRepository.findById(taskDto.getEmployeeId());
        if (optionalUser.isEmpty()) {
            logger.error("Employee with ID {} not found while updating task", taskDto.getEmployeeId());
            throw new UserNotFoundException("Employee with ID " + taskDto.getEmployeeId() + " not found");
        }

        Task existingTask = optionalTask.get();
        existingTask.setTitle(taskDto.getTitle());
        existingTask.setDescription(taskDto.getDescription());
        existingTask.setDueDate(taskDto.getDueDate());
        existingTask.setPriority(taskDto.getPriority());
        existingTask.setTaskStatus(taskDto.getTaskStatus() != null ? taskDto.getTaskStatus() : TaskStatus.INPROGRESS);
        existingTask.setUser(optionalUser.get());

        Task updatedTask = taskRepository.save(existingTask);
        logger.info("Task with ID {} updated successfully", id);
        return taskMapper.toTaskDto(updatedTask);
    }

    @Override
    public List<TaskDto> searchTaskByTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            logger.warn("Search title is null or empty, returning empty list");
            return List.of();
        }

        logger.info("Searching tasks with title containing: {}", title);
        return taskRepository.findAllByTitleContaining(title)
                .stream()
                .sorted(Comparator.comparing(Task::getDueDate, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(taskMapper::toTaskDto)
                .collect(Collectors.toList());
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