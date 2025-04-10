package com.full_stack_coding_assignment.Task.Manager.App.service.jwt;

import com.full_stack_coding_assignment.Task.Manager.App.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                return userRepository.findFirstByUsername(username) // Changed from findFirstByEmail
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
            }
        };
    }
}