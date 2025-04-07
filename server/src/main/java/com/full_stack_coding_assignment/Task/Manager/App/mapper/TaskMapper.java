package com.full_stack_coding_assignment.Task.Manager.App.mapper;

import com.full_stack_coding_assignment.Task.Manager.App.dto.TaskDto;
import com.full_stack_coding_assignment.Task.Manager.App.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskDto toTaskDto(Task task) {
        TaskDto taskDto = new TaskDto();
        taskDto.setId(task.getId());
        taskDto.setTitle(task.getTitle());
        taskDto.setDescription(task.getDescription());
        taskDto.setDueDate(task.getDueDate());
        taskDto.setPriority(task.getPriority());
        taskDto.setTaskStatus(task.getTaskStatus());
        taskDto.setEmployeeId(task.getUser().getId());
        taskDto.setEmployeeName(task.getUser().getName());
        return taskDto;
    }

    public Task toTask(TaskDto taskDto) {
        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setDueDate(taskDto.getDueDate());
        task.setPriority(taskDto.getPriority());
        task.setTaskStatus(taskDto.getTaskStatus());
        return task;
    }
}