package com.full_stack_coding_assignment.Task.Manager.App.dto;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String email;
    private String password;
}
