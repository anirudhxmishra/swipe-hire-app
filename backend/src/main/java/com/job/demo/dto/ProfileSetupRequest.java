package com.job.demo.dto;

import java.util.Set;

public class ProfileSetupRequest {
    private String fullName;
    private String phoneNumber;
    private String bio;
    private String targetRole;
    private int experienceYears;
    private boolean remoteOnly;
    private String preferredLocation;
    private int minSalary;
    
    // --- THIS IS THE CRITICAL MISSING FIELD ---
    private Set<String> socialLinks; 
    // ------------------------------------------
    
    private Set<String> skills;

    // Getters and Setters
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    
    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }
    
    public boolean isRemoteOnly() { return remoteOnly; }
    public void setRemoteOnly(boolean remoteOnly) { this.remoteOnly = remoteOnly; }
    
    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String preferredLocation) { this.preferredLocation = preferredLocation; }
    
    public int getMinSalary() { return minSalary; }
    public void setMinSalary(int minSalary) { this.minSalary = minSalary; }
    
    // --- Getter and Setter for Links ---
    public Set<String> getSocialLinks() { return socialLinks; }
    public void setSocialLinks(Set<String> socialLinks) { this.socialLinks = socialLinks; }
    
    public Set<String> getSkills() { return skills; }
    public void setSkills(Set<String> skills) { this.skills = skills; }
}