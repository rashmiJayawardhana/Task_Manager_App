package com.full_stack_coding_assignment.Task.Manager.App.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.full_stack_coding_assignment.Task.Manager.App.enums.TaskStatus;
import lombok.Data;

import java.util.Date;

@Data
public class TaskDto {
    private Long id;

    private String title;

    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dueDate;

    private String priority;

    private TaskStatus taskStatus;

    private Long employeeId;

    private String employeeName;
}
