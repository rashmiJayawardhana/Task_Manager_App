package com.full_stack_coding_assignment.Task.Manager.App.controller.auth;

import com.full_stack_coding_assignment.Task.Manager.App.dto.AuthenticationRequest;
import com.full_stack_coding_assignment.Task.Manager.App.dto.AuthenticationResponse;
import com.full_stack_coding_assignment.Task.Manager.App.dto.SignupRequest;
import com.full_stack_coding_assignment.Task.Manager.App.dto.UserDto;
import com.full_stack_coding_assignment.Task.Manager.App.entity.User;
import com.full_stack_coding_assignment.Task.Manager.App.repository.UserRepository;
import com.full_stack_coding_assignment.Task.Manager.App.service.auth.AuthService;
import com.full_stack_coding_assignment.Task.Manager.App.service.jwt.UserService;
import com.full_stack_coding_assignment.Task.Manager.App.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser(@RequestBody SignupRequest signupRequest) {
        if (authService.hasUserWithUsername(signupRequest.getUsername())) { // Changed to username
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", HttpStatus.CONFLICT.value());
            errorResponse.put("error", HttpStatus.CONFLICT.getReasonPhrase());
            errorResponse.put("message", "User already exists with this username");
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }
        UserDto createdUserDto = authService.signupUser(signupRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUserDto);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest authenticationRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    authenticationRequest.getUsername(), // Changed from getEmail to getUsername
                    authenticationRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Incorrect username or password");
        }
        final UserDetails userDetails = userService.userDetailsService().loadUserByUsername(authenticationRequest.getUsername()); // Changed from getEmail to getUsername
        Optional<User> optionalUser = userRepository.findFirstByUsername(authenticationRequest.getUsername()); // Changed from findFirstByEmail
        final String jwtToken = jwtUtil.generateToken(userDetails);
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        if (optionalUser.isPresent()) {
            authenticationResponse.setJwt(jwtToken);
            authenticationResponse.setUserId(optionalUser.get().getId());
            authenticationResponse.setUserRole(optionalUser.get().getUserRole());
        }
        return ResponseEntity.ok(authenticationResponse);
    }
}