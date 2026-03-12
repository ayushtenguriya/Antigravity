package com.jobportal.applicationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    private Long userId;
    private String message;
    private String type;      // EMAIL or IN_APP
    private Long referenceId; // applicationId
}
