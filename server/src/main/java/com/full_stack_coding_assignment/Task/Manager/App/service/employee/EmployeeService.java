package com.full_stack_coding_assignment.Task.Manager.App.service.employee;

import com.full_stack_coding_assignment.Task.Manager.App.dto.TaskDto;

import java.util.List;

public interface EmployeeService {

    List<TaskDto> getTasksByUserId();
}
