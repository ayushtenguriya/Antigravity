package com.jobportal.userservice.dto;

import com.jobportal.userservice.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private User.Role role;
    private String phone;
    private String location;
    private String profileSummary;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setPhone(user.getPhone());
        response.setLocation(user.getLocation());
        response.setProfileSummary(user.getProfileSummary());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
