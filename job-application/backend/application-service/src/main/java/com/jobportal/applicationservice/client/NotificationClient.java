package com.jobportal.applicationservice.client;

import com.jobportal.applicationservice.dto.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notification-service", fallback = NotificationClientFallback.class)
public interface NotificationClient {

    @PostMapping("/api/notifications/send")
    ResponseEntity<Object> sendNotification(@RequestBody NotificationRequest request);
}
