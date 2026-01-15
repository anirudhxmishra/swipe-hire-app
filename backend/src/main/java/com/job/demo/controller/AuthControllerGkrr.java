package com.job.demo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.job.demo.dto.GoogleUserDto;
import com.job.demo.service.GoogleOAuthService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/auth")
public class AuthControllerGkrr {

    private static final String CLIENT_ID = "878134136397-74a6qcdke2c22gh278qs7loqplu4stmk.apps.googleusercontent.com";
    private static final String CLIENT_SECRET = "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";
    private static final String REDIRECT_URI =
            "http://localhost:8096/auth/google/callback";

    private static final String FRONTEND_REDIRECT =
            "http://localhost:5173/oauth-success";

    private final GoogleOAuthService googleOAuthService;

    public AuthControllerGkrr(GoogleOAuthService googleOAuthService) {
        this.googleOAuthService = googleOAuthService;
    }

    @GetMapping("/google")
    public void googleLogin(HttpServletResponse response) throws IOException {
        System.out.println("hi there");

        String url = googleOAuthService.getGoogleAuthUrl(
                CLIENT_ID,
                REDIRECT_URI
        );
        response.sendRedirect(url);
    }

    @GetMapping("/google/callback")
    public void callback(
            @RequestParam String code,
            HttpServletResponse response
    ) throws IOException {

        GoogleUserDto user = googleOAuthService.processGoogleCallback(
                code,
                CLIENT_ID,
                CLIENT_SECRET,
                REDIRECT_URI
        );

        String encodedUser = URLEncoder.encode(
                new ObjectMapper().writeValueAsString(user),
                StandardCharsets.UTF_8
        );

        response.sendRedirect(FRONTEND_REDIRECT + "?user=" + encodedUser);
    }
}
