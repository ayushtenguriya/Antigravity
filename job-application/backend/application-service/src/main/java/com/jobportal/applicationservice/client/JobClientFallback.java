package com.jobportal.applicationservice.client;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class JobClientFallback implements JobClient {
    @Override
    public ResponseEntity<Object> getJobById(Long id) {
        return ResponseEntity.notFound().build();
    }
}
