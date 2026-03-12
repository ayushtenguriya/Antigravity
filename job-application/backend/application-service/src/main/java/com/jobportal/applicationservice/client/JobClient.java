package com.jobportal.applicationservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "job-service", fallback = JobClientFallback.class)
public interface JobClient {

    @GetMapping("/api/jobs/{id}")
    ResponseEntity<Object> getJobById(@PathVariable("id") Long id);
}
