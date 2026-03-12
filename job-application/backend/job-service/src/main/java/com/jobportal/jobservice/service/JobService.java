package com.jobportal.jobservice.service;

import com.jobportal.jobservice.dto.JobRequest;
import com.jobportal.jobservice.dto.JobResponse;
import com.jobportal.jobservice.entity.Job;
import com.jobportal.jobservice.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public JobResponse createJob(JobRequest request) {
        Job job = new Job();
        mapToJob(request, job);
        return JobResponse.from(jobRepository.save(job));
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll()
                .stream().map(JobResponse::from).collect(Collectors.toList());
    }

    public List<JobResponse> getActiveJobs() {
        return jobRepository.findByStatus(Job.JobStatus.ACTIVE)
                .stream().map(JobResponse::from).collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        return JobResponse.from(job);
    }

    public List<JobResponse> getJobsByEmployer(Long employerId) {
        return jobRepository.findByEmployerId(employerId)
                .stream().map(JobResponse::from).collect(Collectors.toList());
    }

    public List<JobResponse> searchJobs(String keyword) {
        return jobRepository.findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCase(keyword, keyword)
                .stream().map(JobResponse::from).collect(Collectors.toList());
    }

    public JobResponse updateJob(Long id, JobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));
        mapToJob(request, job);
        return JobResponse.from(jobRepository.save(job));
    }

    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new RuntimeException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }

    private void mapToJob(JobRequest request, Job job) {
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalaryMin(request.getSalaryMin());
        job.setSalaryMax(request.getSalaryMax());
        job.setJobType(request.getJobType());
        job.setStatus(request.getStatus() != null ? request.getStatus() : Job.JobStatus.ACTIVE);
        job.setRequirements(request.getRequirements());
        job.setBenefits(request.getBenefits());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setEmployerId(request.getEmployerId());
    }
}
