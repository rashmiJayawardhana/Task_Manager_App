package com.full_stack_coding_assignment.Task.Manager.App.dto;

import com.full_stack_coding_assignment.Task.Manager.App.enums.UserRole;
import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;

}
