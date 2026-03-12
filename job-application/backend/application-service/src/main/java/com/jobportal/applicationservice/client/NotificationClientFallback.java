package com.jobportal.applicationservice.client;

import com.jobportal.applicationservice.dto.NotificationRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class NotificationClientFallback implements NotificationClient {

    private static final Logger log = Logger.getLogger(NotificationClientFallback.class.getName());

    @Override
    public ResponseEntity<Object> sendNotification(NotificationRequest request) {
        log.warning("Notification service unavailable. Skipping notification for userId: " + request.getUserId());
        return ResponseEntity.ok().build();
    }
}
