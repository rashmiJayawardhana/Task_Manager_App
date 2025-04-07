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
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    @Override
    public List<UserDto> getUsers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getUserRole() == UserRole.EMPLOYEE)
                .map(User::getUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public TaskDto createTask(TaskDto taskDto) {
        Optional<User> optionalUser = userRepository.findById(taskDto.getEmployeeId());
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("Employee with ID " + taskDto.getEmployeeId() + " not found");
        }

        Task task = taskMapper.toTask(taskDto);
        task.setTaskStatus(taskDto.getTaskStatus() != null ? taskDto.getTaskStatus() : TaskStatus.INPROGRESS);
        task.setUser(optionalUser.get());
        Task savedTask = taskRepository.save(task);
        return taskMapper.toTaskDto(savedTask);
    }

    @Override
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .filter(task -> task.getUser().getUserRole() == UserRole.EMPLOYEE) // Filter tasks for employees only
                .sorted(Comparator.comparing(Task::getDueDate, Comparator.nullsLast(Comparator.reverseOrder()))) // Handle null dueDate
                .map(taskMapper::toTaskDto) // Use TaskMapper
                .collect(Collectors.toList());
    }
}