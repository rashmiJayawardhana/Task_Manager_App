package com.full_stack_coding_assignment.Task.Manager.App.service.auth;

import com.full_stack_coding_assignment.Task.Manager.App.dto.SignupRequest;
import com.full_stack_coding_assignment.Task.Manager.App.dto.UserDto;

public interface AuthService {

    UserDto signupUser(SignupRequest signupRequest);
    boolean hasUserWithEmail(String email);
}
