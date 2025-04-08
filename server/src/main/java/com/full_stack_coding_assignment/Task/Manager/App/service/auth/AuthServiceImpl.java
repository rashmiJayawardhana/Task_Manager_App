package com.full_stack_coding_assignment.Task.Manager.App.service.auth;

import com.full_stack_coding_assignment.Task.Manager.App.dto.SignupRequest;
import com.full_stack_coding_assignment.Task.Manager.App.dto.UserDto;
import com.full_stack_coding_assignment.Task.Manager.App.entity.User;
import com.full_stack_coding_assignment.Task.Manager.App.enums.UserRole;
import com.full_stack_coding_assignment.Task.Manager.App.mapper.UserMapper;
import com.full_stack_coding_assignment.Task.Manager.App.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @PostConstruct
    public void createAnAdminAccount() {
        Optional<User> optionalUser = userRepository.findByUserRole(UserRole.ADMIN);
        if (optionalUser.isEmpty()) {
            User user = new User();
            user.setUsername("admin"); // Changed from email to username
            user.setName("Admin");
            user.setPassword(new BCryptPasswordEncoder().encode("admin"));
            user.setUserRole(UserRole.ADMIN);
            userRepository.save(user);
            System.out.println("Admin account created successfully!");
        } else {
            System.out.println("Admin account already exist!");
        }
    }

    @Override
    public UserDto signupUser(SignupRequest signupRequest) {
        User user = new User();
        user.setUsername(signupRequest.getUsername()); // Changed from email to username
        user.setName(signupRequest.getName());
        user.setPassword(new BCryptPasswordEncoder().encode(signupRequest.getPassword()));
        user.setUserRole(UserRole.EMPLOYEE);
        User createdUser = userRepository.save(user);
        return userMapper.toUserDto(createdUser);
    }

    @Override
    public boolean hasUserWithUsername(String username) {
        return userRepository.findFirstByUsername(username).isPresent(); // Changed to username
    }
}