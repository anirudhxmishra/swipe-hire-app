package com.job.demo.controller;

// Your existing imports
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.job.demo.dto.RegistrationRequest;
import com.job.demo.model.User;
import com.job.demo.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
// --- END OF NEW IMPORTS ---


@RestController
@RequestMapping("/api/auth") // All URLs in this class will start with /api/auth
public class AuthController {

    @Autowired
    private UserRepository userRepository; // To save the user

    @Autowired
    private PasswordEncoder passwordEncoder; // To hash the password

    // --- 1. INJECT THE AUTHENTICATION MANAGER ---
    @Autowired
    private AuthenticationManager authenticationManager;


    // --- 2. UPDATE THE METHOD SIGNATURE ---
    @PostMapping("/register") // The full URL is /api/auth/register
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest request, HttpServletRequest httpRequest) {

        // 1. Check if passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Error: Passwords do not match!");
        }

        // 2. Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already taken!");
        }

        // 3. Create new user's account
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());

        // 4. *** THIS IS THE CRITICAL STEP ***
        // Hash the password before saving
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(hashedPassword);
        user.setPhoneNumber(request.getPhoneNumber());

        // 5. Save the user to the database
        userRepository.save(user);

        // --- 6. NEW: AUTO-LOGIN LOGIC ---
        // This programmatically authenticates the new user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), // username
                        request.getPassword()  // the raw, un-hashed password
                )
        );

        // Set the user as authenticated in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Create the session and cookie for the frontend
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
        // --- END OF AUTO-LOGIN LOGIC ---

        return ResponseEntity.ok("User registered successfully! You are now logged in.");
    }

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome! You are logged in.";
    }
}