package com.jobportal.userservice.dto;

import com.jobportal.userservice.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private User.Role role = User.Role.SEEKER;

    private String phone;
    private String location;
    private String profileSummary;
}
