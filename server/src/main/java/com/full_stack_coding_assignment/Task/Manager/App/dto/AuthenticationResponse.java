package com.full_stack_coding_assignment.Task.Manager.App.dto;

import com.full_stack_coding_assignment.Task.Manager.App.enums.UserRole;
import lombok.Data;

@Data
public class AuthenticationResponse {
    private String jwt;
    private Long userId;
    private UserRole userRole;
}
