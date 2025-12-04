package com.job.demo.controller;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.job.demo.dto.ProfileResponse;
import com.job.demo.dto.ProfileSetupRequest;
import com.job.demo.model.Skill;
import com.job.demo.model.User;
import com.job.demo.model.UserProfile;
import com.job.demo.repository.SkillRepository;
import com.job.demo.repository.UserProfileRepository;
import com.job.demo.repository.UserRepository;
import com.job.demo.service.FileStorageService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserProfileRepository userProfileRepository;
    @Autowired
    private SkillRepository skillRepository;
    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);
        ProfileResponse response = new ProfileResponse();
        
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhoneNumber());

        if (profile != null) {
            response.setTargetRole(profile.getTargetRole());
            response.setExperienceYears(profile.getExperienceYears());
            response.setBio(profile.getBio());
            response.setRemoteOnly(profile.isRemoteOnly());
            response.setPreferredLocation(profile.getPreferredLocation());
            response.setMinSalary(profile.getMinSalary());
            response.setProfilePictureUrl(profile.getProfilePictureUrl());
            response.setResumeUrl(profile.getResumeUrl());
            
            // --- MERGE LOGIC ---
            Set<String> allLinks = new HashSet<>();
            if (profile.getSocialLinks() != null) {
                allLinks.addAll(profile.getSocialLinks());
            }
            if (profile.getGithubProfile() != null && !profile.getGithubProfile().isEmpty()) {
                allLinks.add(profile.getGithubProfile());
            }
            if (profile.getLinkedinProfile() != null && !profile.getLinkedinProfile().isEmpty()) {
                allLinks.add(profile.getLinkedinProfile());
            }
            response.setSocialLinks(allLinks);
            // -------------------

            if (profile.getSkills() != null) {
                response.setSkills(profile.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()));
            } else {
                response.setSkills(new HashSet<>());
            }
        } else {
            response.setSkills(new HashSet<>());
            response.setSocialLinks(new HashSet<>());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/setup")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody ProfileSetupRequest request) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        userRepository.save(user);

        UserProfile profile = userProfileRepository.findByUser(user).orElse(new UserProfile());
        if (profile.getUser() == null) profile.setUser(user);

        profile.setBio(request.getBio());
        profile.setTargetRole(request.getTargetRole());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setRemoteOnly(request.isRemoteOnly());
        profile.setPreferredLocation(request.getPreferredLocation());
        profile.setMinSalary(request.getMinSalary());
        
        // --- HANDLE LINKS (ADD & DELETE) ---
        if (request.getSocialLinks() != null) {
            if (profile.getSocialLinks() == null) {
                profile.setSocialLinks(new HashSet<>());
            }
            // 1. Clear existing list (Deletes removed links)
            profile.getSocialLinks().clear(); 
            // 2. Add current list from Frontend
            profile.getSocialLinks().addAll(request.getSocialLinks());
            
            // 3. Wipe old columns
            profile.setGithubProfile(null);
            profile.setLinkedinProfile(null);
        }

        if (request.getSkills() != null) {
            Set<Skill> newSkills = new HashSet<>();
            for (String skillName : request.getSkills()) {
                String normalizedName = skillName.trim(); 
                Skill skill = skillRepository.findByName(normalizedName)
                        .orElseGet(() -> skillRepository.save(new Skill(normalizedName)));
                newSkills.add(skill);
            }
            profile.setSkills(newSkills);
        }

        userProfileRepository.save(profile);
        return ResponseEntity.ok("Profile updated successfully!");
    }
    
    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadProfilePicture(Authentication authentication, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) return ResponseEntity.badRequest().body("No file uploaded");
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        UserProfile profile = userProfileRepository.findByUser(user).orElse(new UserProfile());
        if(profile.getUser() == null) profile.setUser(user);
        if(profile.getProfilePictureUrl() != null) fileStorageService.deleteFile(profile.getProfilePictureUrl());
        String fileUrl = fileStorageService.storeFile(file, "profile-pictures");
        profile.setProfilePictureUrl(fileUrl);
        userProfileRepository.save(profile);
        return ResponseEntity.ok(fileUrl);
    }

    @PostMapping("/upload-resume")
    public ResponseEntity<?> uploadResume(Authentication authentication, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) return ResponseEntity.badRequest().body("No file uploaded");
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        UserProfile profile = userProfileRepository.findByUser(user).orElse(new UserProfile());
        if(profile.getUser() == null) profile.setUser(user);
        if(profile.getResumeUrl() != null) fileStorageService.deleteFile(profile.getResumeUrl());
        String fileUrl = fileStorageService.storeFile(file, "resumes");
        profile.setResumeUrl(fileUrl);
        userProfileRepository.save(profile);
        return ResponseEntity.ok(fileUrl);
    }
}