package com.example.gym_notes.service;

import com.example.gym_notes.model.dto.UserLoginDTO;
import org.keycloak.representations.AccessTokenResponse;


public interface UserService {
    AccessTokenResponse login(UserLoginDTO loginData);
}
