package com.job.demo.job.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.job.demo.job.model.Job;

public interface JobRepository extends JpaRepository<Job, String> {
}
