package com.job.demo.job.dto;

import java.util.List;

import com.job.demo.job.model.Job;

public class JobSyncRequest {

    private List<Job> jobs;

    public JobSyncRequest() {}

    public List<Job> getJobs() {
        return jobs;
    }

    public void setJobs(List<Job> jobs) {
        this.jobs = jobs;
    }
}
