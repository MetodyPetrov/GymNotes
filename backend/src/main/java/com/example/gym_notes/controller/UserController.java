package com.example.gym_notes.controller;

import com.example.gym_notes.model.dto.LoginResponse;
import com.example.gym_notes.model.dto.UserLoginDTO;
import com.example.gym_notes.service.UserService;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDTO loginDTO) {
        try {
            AccessTokenResponse tokenResponse = userService.login(loginDTO);
            LoginResponse response = new LoginResponse(true, tokenResponse, null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LoginResponse response = new LoginResponse(false, null, "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}