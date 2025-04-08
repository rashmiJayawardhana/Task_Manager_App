package com.full_stack_coding_assignment.Task.Manager.App.service.admin;

import com.full_stack_coding_assignment.Task.Manager.App.dto.CommentDto;
import com.full_stack_coding_assignment.Task.Manager.App.dto.TaskDto;
import com.full_stack_coding_assignment.Task.Manager.App.dto.UserDto;

import java.util.List;

public interface AdminService {

    TaskDto createTask(TaskDto taskDto);

    List<UserDto> getUsers();

    List<TaskDto> getAllTasks();

    void deleteTask(Long id);

    TaskDto updateTask(Long id, TaskDto taskDto);

    List<TaskDto> searchTaskByTitle(String title);

    void updateUserProfileImage(Long userId, String imageName);

    TaskDto getTaskById(Long id);

    CommentDto createComment(Long taskId, String content);

    List<CommentDto> getCommentsByTaskId(Long taskId);
}
