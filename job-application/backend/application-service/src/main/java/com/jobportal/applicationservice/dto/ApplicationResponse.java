package com.jobportal.applicationservice.dto;

import com.jobportal.applicationservice.entity.Application;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {

    private Long id;
    private Long jobId;
    private Long seekerId;
    private String coverLetter;
    private String resumeUrl;
    private String status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public static ApplicationResponse from(Application app) {
        ApplicationResponse resp = new ApplicationResponse();
        resp.setId(app.getId());
        resp.setJobId(app.getJobId());
        resp.setSeekerId(app.getSeekerId());
        resp.setCoverLetter(app.getCoverLetter());
        resp.setResumeUrl(app.getResumeUrl());
        resp.setStatus(app.getStatus().name());
        resp.setAppliedAt(app.getAppliedAt());
        resp.setUpdatedAt(app.getUpdatedAt());
        return resp;
    }
}
