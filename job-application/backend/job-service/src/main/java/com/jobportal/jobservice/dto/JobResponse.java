package com.jobportal.jobservice.dto;

import com.jobportal.jobservice.entity.Job;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class JobResponse {
    private Long id;
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
    private LocalDateTime postedAt;

    public static JobResponse from(Job job) {
        JobResponse r = new JobResponse();
        r.setId(job.getId());
        r.setTitle(job.getTitle());
        r.setDescription(job.getDescription());
        r.setCompany(job.getCompany());
        r.setLocation(job.getLocation());
        r.setSalaryMin(job.getSalaryMin());
        r.setSalaryMax(job.getSalaryMax());
        r.setJobType(job.getJobType());
        r.setStatus(job.getStatus());
        r.setRequirements(job.getRequirements());
        r.setBenefits(job.getBenefits());
        r.setExperienceLevel(job.getExperienceLevel());
        r.setEmployerId(job.getEmployerId());
        r.setPostedAt(job.getPostedAt());
        return r;
    }
}
