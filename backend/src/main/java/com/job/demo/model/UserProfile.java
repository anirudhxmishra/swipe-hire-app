package com.job.demo.model;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    private String profilePictureUrl;
    
    @Column(length = 1000)
    private String bio;

    private String targetRole;
    private int experienceYears;
    private String resumeUrl;
    private boolean remoteOnly;
    private String preferredLocation;
    private int minSalary;

    // --- LEGACY COLUMNS (Kept to prevent errors with existing data) ---
    @Column(name = "github_profile")
    private String githubProfile;

    @Column(name = "linkedin_profile")
    private String linkedinProfile;

    // --- NEW DYNAMIC LINKS TABLE ---
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_profile_links", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "link_url")
    private Set<String> socialLinks = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "profile_skills",
            joinColumns = @JoinColumn(name = "profile_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id"))
    private Set<Skill> skills = new HashSet<>();

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String url) { this.profilePictureUrl = url; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int years) { this.experienceYears = years; }
    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String url) { this.resumeUrl = url; }
    public boolean isRemoteOnly() { return remoteOnly; }
    public void setRemoteOnly(boolean remoteOnly) { this.remoteOnly = remoteOnly; }
    public String getPreferredLocation() { return preferredLocation; }
    public void setPreferredLocation(String loc) { this.preferredLocation = loc; }
    public int getMinSalary() { return minSalary; }
    public void setMinSalary(int salary) { this.minSalary = salary; }
    public Set<Skill> getSkills() { return skills; }
    public void setSkills(Set<Skill> skills) { this.skills = skills; }
    
    // New Getters/Setters
    public Set<String> getSocialLinks() { return socialLinks; }
    public void setSocialLinks(Set<String> socialLinks) { this.socialLinks = socialLinks; }
    
    public String getGithubProfile() { return githubProfile; }
    public void setGithubProfile(String githubProfile) { this.githubProfile = githubProfile; }
    public String getLinkedinProfile() { return linkedinProfile; }
    public void setLinkedinProfile(String linkedinProfile) { this.linkedinProfile = linkedinProfile; }
}