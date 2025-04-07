package com.full_stack_coding_assignment.Task.Manager.App.service.admin;

import com.full_stack_coding_assignment.Task.Manager.App.dto.TaskDto;
import com.full_stack_coding_assignment.Task.Manager.App.dto.UserDto;

import java.util.List;

public interface AdminService {

    List<UserDto> getUsers();

    TaskDto createTask(TaskDto taskDto);

    List<TaskDto> getAllTasks();
}
