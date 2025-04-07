package com.full_stack_coding_assignment.Task.Manager.App.service.admin;

import com.full_stack_coding_assignment.Task.Manager.App.dto.TaskDto;
import com.full_stack_coding_assignment.Task.Manager.App.dto.UserDto;
import com.full_stack_coding_assignment.Task.Manager.App.entity.Task;
import com.full_stack_coding_assignment.Task.Manager.App.entity.User;
import com.full_stack_coding_assignment.Task.Manager.App.enums.TaskStatus;
import com.full_stack_coding_assignment.Task.Manager.App.enums.UserRole;
import com.full_stack_coding_assignment.Task.Manager.App.mapper.TaskMapper;
import com.full_stack_coding_assignment.Task.Manager.App.repository.TaskRepository;
import com.full_stack_coding_assignment.Task.Manager.App.repository.UserRepository;
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
public class AdminServiceImpl implements AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    @Override
    public List<UserDto> getUsers() {
        logger.info("Fetching all users with role EMPLOYEE");
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getUserRole() == UserRole.EMPLOYEE)
                .map(User::getUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDto createTask(TaskDto taskDto) {
        logger.info("Creating task for employee ID: {}", taskDto.getEmployeeId());
        Optional<User> optionalUser = userRepository.findById(taskDto.getEmployeeId());
        if (optionalUser.isEmpty()) {
            logger.error("Employee with ID {} not found while creating task", taskDto.getEmployeeId());
            throw new IllegalArgumentException("Employee with ID " + taskDto.getEmployeeId() + " not found");
        }

        Task task = taskMapper.toTask(taskDto);
        task.setTaskStatus(taskDto.getTaskStatus() != null ? taskDto.getTaskStatus() : TaskStatus.INPROGRESS);
        task.setUser(optionalUser.get());
        Task savedTask = taskRepository.save(task);
        logger.info("Task created with ID: {}", savedTask.getId());
        return taskMapper.toTaskDto(savedTask);
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
            throw new IllegalArgumentException("Task with ID " + id + " not found");
        }
        taskRepository.deleteById(id);
        logger.info("Task with ID {} deleted successfully", id);
    }

    @Override
    public TaskDto getTaskById(Long id) {
        logger.info("Fetching task with ID: {}", id);
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            logger.error("Task with ID {} not found while fetching", id);
            throw new IllegalArgumentException("Task with ID " + id + " not found");
        }
        return taskMapper.toTaskDto(optionalTask.get());
    }

    @Override
    public TaskDto updateTask(Long id, TaskDto taskDto) {
        logger.info("Updating task with ID: {}", id);
        Optional<Task> optionalTask = taskRepository.findById(id);
        if (optionalTask.isEmpty()) {
            logger.error("Task with ID {} not found while updating", id);
            throw new IllegalArgumentException("Task with ID " + id + " not found");
        }

        Optional<User> optionalUser = userRepository.findById(taskDto.getEmployeeId());
        if (optionalUser.isEmpty()) {
            logger.error("Employee with ID {} not found while updating task", taskDto.getEmployeeId());
            throw new IllegalArgumentException("Employee with ID " + taskDto.getEmployeeId() + " not found");
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
}