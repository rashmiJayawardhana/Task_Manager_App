package com.full_stack_coding_assignment.Task.Manager.App.mapper;

import com.full_stack_coding_assignment.Task.Manager.App.dto.TaskDto;
import com.full_stack_coding_assignment.Task.Manager.App.entity.Task;
import com.full_stack_coding_assignment.Task.Manager.App.enums.TaskStatus;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskDto toTaskDto(Task task) {
        TaskDto taskDto = new TaskDto();
        taskDto.setId(task.getId());
        taskDto.setTitle(task.getTitle());
        taskDto.setDescription(task.getDescription());
        taskDto.setCreatedAt(task.getCreatedAt());
        taskDto.setDueDate(task.getDueDate());
        taskDto.setPriority(task.getPriority() != null ? task.getPriority() : "LOW");
        taskDto.setTaskStatus(task.getTaskStatus() != null ? task.getTaskStatus() : TaskStatus.INPROGRESS);
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
        // createdAt is not set here; it will be set automatically by @PrePersist
        return task;
    }
}