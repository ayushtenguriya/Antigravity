package com.jobportal.jobservice.repository;

import com.jobportal.jobservice.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByEmployerId(Long employerId);

    List<Job> findByStatus(Job.JobStatus status);

    List<Job> findByTitleContainingIgnoreCaseOrCompanyContainingIgnoreCase(String title, String company);

    List<Job> findByLocationContainingIgnoreCase(String location);
}
