package com.job.demo.service;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.job.demo.dto.GoogleUserDto;

@Service
public class GoogleOAuthService {

    public String getGoogleAuthUrl(String clientId, String redirectUri) {
        return "https://accounts.google.com/o/oauth2/v2/auth"
                + "?client_id=" + clientId
                + "&redirect_uri=" + redirectUri
                + "&response_type=code"
                + "&scope=profile email";
    }

    public GoogleUserDto processGoogleCallback(
            String code,
            String clientId,
            String clientSecret,
            String redirectUri
    ) {

        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", clientId);
        body.add("client_secret", clientSecret);
        body.add("code", code);
        body.add("redirect_uri", redirectUri);
        body.add("grant_type", "authorization_code");

        Map tokenResponse = restTemplate.postForObject(
                "https://oauth2.googleapis.com/token",
                body,
                Map.class
        );

        String accessToken = (String) tokenResponse.get("access_token");

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<Map> userInfo = restTemplate.exchange(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                HttpMethod.GET,
                entity,
                Map.class
        );

        Map profile = userInfo.getBody();

        return new GoogleUserDto(
                (String) profile.get("id"),
                (String) profile.get("name"),
                (String) profile.get("email"),
                (String) profile.get("picture")
        );
    }
}
