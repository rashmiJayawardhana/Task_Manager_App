package com.full_stack_coding_assignment.Task.Manager.App.service.employee;

import com.full_stack_coding_assignment.Task.Manager.App.dto.CommentDto;
import com.full_stack_coding_assignment.Task.Manager.App.dto.TaskDto;

import java.util.List;

public interface EmployeeService {

    List<TaskDto> getTasksByUserId();

    TaskDto updateTask(Long id, String status);

    void updateUserProfileImage(Long userId, String imageName);

    TaskDto getTaskById(Long id);

    List<TaskDto> searchTaskByTitle(String title);

    CommentDto createComment(Long taskId, String content);

    List<CommentDto> getCommentsByTaskId(Long taskId);

}
