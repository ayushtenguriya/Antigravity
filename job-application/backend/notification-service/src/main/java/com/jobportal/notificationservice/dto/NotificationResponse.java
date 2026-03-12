package com.jobportal.notificationservice.dto;

import com.jobportal.notificationservice.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private Long userId;
    private String message;
    private String type;
    private boolean isRead;
    private Long referenceId;
    private LocalDateTime createdAt;

    public static NotificationResponse from(Notification n) {
        NotificationResponse resp = new NotificationResponse();
        resp.setId(n.getId());
        resp.setUserId(n.getUserId());
        resp.setMessage(n.getMessage());
        resp.setType(n.getType().name());
        resp.setRead(n.isRead());
        resp.setReferenceId(n.getReferenceId());
        resp.setCreatedAt(n.getCreatedAt());
        return resp;
    }
}
