package com.jobportal.notificationservice.service;

import com.jobportal.notificationservice.dto.NotificationRequest;
import com.jobportal.notificationservice.dto.NotificationResponse;
import com.jobportal.notificationservice.entity.Notification;
import com.jobportal.notificationservice.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public NotificationResponse send(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setUserId(request.getUserId());
        notification.setMessage(request.getMessage());
        notification.setReferenceId(request.getReferenceId());

        try {
            notification.setType(Notification.NotificationType.valueOf(
                    request.getType() != null ? request.getType().toUpperCase() : "IN_APP"));
        } catch (IllegalArgumentException e) {
            notification.setType(Notification.NotificationType.IN_APP);
        }

        notification.setRead(false);
        return NotificationResponse.from(notificationRepository.save(notification));
    }

    public List<NotificationResponse> getByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(NotificationResponse::from).collect(Collectors.toList());
    }

    public NotificationResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        notification.setRead(true);
        return NotificationResponse.from(notificationRepository.save(notification));
    }

    public long countUnread(Long userId) {
        return notificationRepository.findByUserIdAndIsRead(userId, false).size();
    }
}
