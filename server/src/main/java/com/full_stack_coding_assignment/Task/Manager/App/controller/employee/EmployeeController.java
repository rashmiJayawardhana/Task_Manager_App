package com.full_stack_coding_assignment.Task.Manager.App.controller.employee;

import com.full_stack_coding_assignment.Task.Manager.App.dto.CommentDto;
import com.full_stack_coding_assignment.Task.Manager.App.dto.TaskDto;
import com.full_stack_coding_assignment.Task.Manager.App.dto.UserDto;
import com.full_stack_coding_assignment.Task.Manager.App.entity.User;
import com.full_stack_coding_assignment.Task.Manager.App.service.employee.EmployeeService;
import com.full_stack_coding_assignment.Task.Manager.App.util.JwtUtil;
import com.full_stack_coding_assignment.Task.Manager.App.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/employee")
@CrossOrigin("*")
public class EmployeeController {
    private final EmployeeService employeeService;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    @GetMapping("/tasks")
    public ResponseEntity<List<TaskDto>> getTasksByUserId() {
        return ResponseEntity.ok(employeeService.getTasksByUserId());
    }

    @PatchMapping("/task/{id}/status/{status}")
    public ResponseEntity<TaskDto> updateTaskStatus(@PathVariable Long id, @PathVariable String status) {
        TaskDto updatedTaskDto = employeeService.updateTask(id, status);
        return ResponseEntity.ok(updatedTaskDto);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getLoggedInUser() {
        User user = jwtUtil.getLoggedInUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(userMapper.toUserDto(user));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only image files are allowed");
            }
            long maxFileSize = 5 * 1024 * 1024;
            if (file.getSize() > maxFileSize) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File size exceeds the maximum limit of 5MB");
            }
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String uniqueFileName = System.currentTimeMillis() + fileExtension;
            Path path = Paths.get("src/main/resources/static/images/" + uniqueFileName);
            Files.copy(file.getInputStream(), path);
            return ResponseEntity.ok(uniqueFileName);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage());
        }
    }

    @PutMapping("/user/{userId}/profile-image")
    public ResponseEntity<String> updateUserProfileImage(@PathVariable Long userId, @RequestParam String imageName) {
        employeeService.updateUserProfileImage(userId, imageName);
        return ResponseEntity.ok("Profile image updated successfully");
    }

    @GetMapping("/task/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id) {
        TaskDto taskDto = employeeService.getTaskById(id);
        return ResponseEntity.ok(taskDto);
    }

    @PostMapping("/task/{taskId}/comment")
    public ResponseEntity<CommentDto> createComment(@PathVariable Long taskId, @RequestParam String content) {
        CommentDto createdCommentDto = employeeService.createComment(taskId, content);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCommentDto);
    }

    @GetMapping("/task/{taskId}/comments")
    public ResponseEntity<List<CommentDto>> getCommentsByTaskId(@PathVariable Long taskId) {
        return ResponseEntity.ok(employeeService.getCommentsByTaskId(taskId));
    }
}