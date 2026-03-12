package com.jobportal.jobservice.dto;

import com.jobportal.jobservice.entity.Job;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class JobRequest {
    private String title;
    private String description;
    private String company;
    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private Job.JobType jobType;
    private Job.JobStatus status;
    private String requirements;
    private String benefits;
    private String experienceLevel;
    private Long employerId;
}
