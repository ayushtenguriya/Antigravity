package com.jobportal.applicationservice.repository;

import com.jobportal.applicationservice.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByJobId(Long jobId);

    List<Application> findBySeekerId(Long seekerId);

    boolean existsByJobIdAndSeekerId(Long jobId, Long seekerId);
}
