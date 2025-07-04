package com.example.gym_notes.service.impl;

import com.example.gym_notes.model.dto.UserLoginDTO;
import com.example.gym_notes.service.UserService;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    private final Keycloak keycloak;

    public UserServiceImpl(Keycloak keycloak) {
        this.keycloak = keycloak;
    }
    @Override
    public AccessTokenResponse login(UserLoginDTO loginData) {
        Keycloak keycloakLogin = KeycloakBuilder.builder()
                .serverUrl("http://localhost:8081")
                .realm("myrealm")
                .clientId("my-spring-app")
                .clientSecret("Fayi5BT1OtpV9sP2eYK8IsJszj2pqQsy")
                .username(loginData.getUsername())
                .password(loginData.getPassword())
                .grantType(OAuth2Constants.PASSWORD)
                .build();

        return keycloakLogin.tokenManager().getAccessToken();
    }
}