package com.full_stack_coding_assignment.Task.Manager.App.mapper;

import com.full_stack_coding_assignment.Task.Manager.App.dto.UserDto;
import com.full_stack_coding_assignment.Task.Manager.App.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toUserDto(User user) {
        if (user == null) {
            return null;
        }
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setUsername(user.getUsername());
        userDto.setUserRole(user.getUserRole());
        userDto.setProfileImage(user.getProfileImage() != null ? user.getProfileImage() : "default-profile.png");
        // Do not map password
        return userDto;
    }

    public User toUser(UserDto userDto) {
        if (userDto == null) {
            return null;
        }
        User user = new User();
        user.setId(userDto.getId());
        user.setName(userDto.getName());
        user.setUsername(userDto.getUsername());
        user.setUserRole(userDto.getUserRole());
        user.setProfileImage(userDto.getProfileImage());
        // Do not map password (it should be set separately, e.g., during signup)
        return user;
    }
}