package com.job.demo.job.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.job.demo.job.model.Job;
import com.job.demo.job.service.JobService;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JobService jobService;
    private final RestTemplate restTemplate = new RestTemplate();

    private static final String N8N_WEBHOOK_URL =
        "http://localhost:5678/webhook-test/jobs";

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // ✅ Fetch jobs from DB
    @GetMapping
    public List<Job> getJobs() {
        return jobService.getAllJobs();
    }

    // ✅ Fetch from n8n → save → DB
    @GetMapping("/fetch-external")
    public ResponseEntity<?> fetchJobsFromN8n() {

        List<Map<String, Object>> jobs =
                restTemplate.getForObject(N8N_WEBHOOK_URL, List.class);

        if (jobs == null || jobs.isEmpty()) {
            return ResponseEntity.badRequest().body("No jobs received from n8n");
        }

        jobService.syncJobsFromMaps(jobs);

        return ResponseEntity.ok("Jobs synced: " + jobs.size());
    }
}
