package com.job.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.job.demo.model.User;
import com.job.demo.model.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    // Add this method to safely fetch profile by user
    Optional<UserProfile> findByUser(User user);
}