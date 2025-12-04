package com.job.demo.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final Path uploadDir;

    public FileStorageService() {
        // Defines the root upload directory
        this.uploadDir = Paths.get("uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
            Files.createDirectories(this.uploadDir.resolve("profile-pictures"));
            Files.createDirectories(this.uploadDir.resolve("resumes"));
        } catch (IOException ex) {
            throw new RuntimeException("Could not create upload directories!", ex);
        }
    }

    public String storeFile(MultipartFile file, String subDir) {
        try {
            String originalFileName = file.getOriginalFilename();
            // Generate unique filename to prevent overwriting
            String fileName = UUID.randomUUID().toString() + "_" + originalFileName;
            
            Path targetLocation = this.uploadDir.resolve(subDir).resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Return the relative URL compatible with WebMvcConfig
            return "/uploads/" + subDir + "/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename(), ex);
        }
    }

    // --- THIS IS THE MISSING METHOD ---
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) return;
        try {
            // Extract filename from URL (e.g., "/uploads/profile-pictures/abc.jpg" -> "abc.jpg")
            String filename = Paths.get(fileUrl).getFileName().toString();
            
            // Determine subdirectory based on URL
            String subDir = fileUrl.contains("profile-pictures") ? "profile-pictures" : "resumes";
            
            Path filePath = this.uploadDir.resolve(subDir).resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            System.err.println("Warning: Could not delete old file: " + fileUrl);
        }
    }
}