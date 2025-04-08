package com.full_stack_coding_assignment.Task.Manager.App.dto;

import com.full_stack_coding_assignment.Task.Manager.App.enums.UserRole;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String password;
    private UserRole userRole;
    private String profileImage;
}
