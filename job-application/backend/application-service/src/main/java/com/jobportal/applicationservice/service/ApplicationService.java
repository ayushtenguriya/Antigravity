package com.jobportal.applicationservice.service;

import com.jobportal.applicationservice.client.JobClient;
import com.jobportal.applicationservice.client.NotificationClient;
import com.jobportal.applicationservice.dto.ApplicationRequest;
import com.jobportal.applicationservice.dto.ApplicationResponse;
import com.jobportal.applicationservice.dto.NotificationRequest;
import com.jobportal.applicationservice.entity.Application;
import com.jobportal.applicationservice.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobClient jobClient;

    @Autowired
    private NotificationClient notificationClient;

    public ApplicationResponse applyForJob(ApplicationRequest request) {
        // Validate job exists via Feign
        var jobResponse = jobClient.getJobById(request.getJobId());
        if (jobResponse == null || !jobResponse.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Job not found with id: " + request.getJobId());
        }

        // Prevent duplicate applications
        if (applicationRepository.existsByJobIdAndSeekerId(request.getJobId(), request.getSeekerId())) {
            throw new RuntimeException("You have already applied for this job.");
        }

        Application application = new Application();
        application.setJobId(request.getJobId());
        application.setSeekerId(request.getSeekerId());
        application.setCoverLetter(request.getCoverLetter());
        application.setResumeUrl(request.getResumeUrl());

        Application saved = applicationRepository.save(application);

        // Notify via notification-service (fire-and-forget, fallback is safe)
        try {
            notificationClient.sendNotification(new NotificationRequest(
                    saved.getSeekerId(),
                    "Your application for job #" + saved.getJobId() + " has been submitted!",
                    "IN_APP",
                    saved.getId()
            ));
        } catch (Exception ignored) {}

        return ApplicationResponse.from(saved);
    }

    public List<ApplicationResponse> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId)
                .stream().map(ApplicationResponse::from).collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsBySeeker(Long seekerId) {
        return applicationRepository.findBySeekerId(seekerId)
                .stream().map(ApplicationResponse::from).collect(Collectors.toList());
    }

    public ApplicationResponse getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
        return ApplicationResponse.from(app);
    }

    public ApplicationResponse updateStatus(Long id, String status) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

        Application.ApplicationStatus newStatus = Application.ApplicationStatus.valueOf(status.toUpperCase());
        app.setStatus(newStatus);
        Application saved = applicationRepository.save(app);

        // Notify seeker of status change
        try {
            notificationClient.sendNotification(new NotificationRequest(
                    saved.getSeekerId(),
                    "Your application #" + saved.getId() + " status has been updated to: " + status,
                    "IN_APP",
                    saved.getId()
            ));
        } catch (Exception ignored) {}

        return ApplicationResponse.from(saved);
    }

    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new RuntimeException("Application not found with id: " + id);
        }
        applicationRepository.deleteById(id);
    }
}
