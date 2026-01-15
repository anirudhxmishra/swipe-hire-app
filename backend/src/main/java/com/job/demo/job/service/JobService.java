package com.job.demo.job.service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.job.demo.job.model.Job;
import com.job.demo.job.repository.JobRepository;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public void syncJobsFromMaps(List<Map<String, Object>> jobMaps) {
        for (Map<String, Object> jobMap : jobMaps) {
            Job job = new Job();
            
            // Map keys exactly as they appear in the n8n Output image
            String id = (String) jobMap.get("id");
            String title = (String) jobMap.get("title");
            String company = (String) jobMap.get("company");
            String location = (String) jobMap.get("location");
            String link = (String) jobMap.get("link"); // n8n uses 'link'

            job.setId(id != null ? id : UUID.randomUUID().toString());
            job.setTitle(title);
            job.setCompany(company);
            job.setLocation(location);
            
            // Use correct setters from Job.java model
            job.setApplyUrl(link); 
            
            // Initialize JSON fields as empty strings to prevent Frontend parsing errors
            job.setBenefits("[]");
            job.setQualifications("[]");
            job.setFullDescription("{}");

            jobRepository.save(job);
        }
    }
}