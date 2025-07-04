package com.example.gym_notes.service.impl;

import com.example.gym_notes.model.dto.LoginResponseDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.UserLoginDTO;
import com.example.gym_notes.model.dto.UserRegisterDTO;
import com.example.gym_notes.service.UserService;
import jakarta.ws.rs.core.Response;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final Keycloak keycloakAdminClient;

    public UserServiceImpl(Keycloak keycloakAdminClient) {
        this.keycloakAdminClient = keycloakAdminClient;
    }

    @Override
    public LoginResponseDTO login(UserLoginDTO loginData) {
        Keycloak keycloakLogin = KeycloakBuilder.builder()
                .serverUrl("http://localhost:8081")
                .realm("myrealm")
                .clientId("my-spring-app")
                .clientSecret("Fayi5BT1OtpV9sP2eYK8IsJszj2pqQsy")
                .username(loginData.getUsername())
                .password(loginData.getPassword())
                .grantType(OAuth2Constants.PASSWORD)
                .build();
        try {
            AccessTokenResponse tokenResponse = keycloakLogin.tokenManager().getAccessToken();
            return new LoginResponseDTO(true, tokenResponse, null);
        } catch (Exception e) {
            return new LoginResponseDTO(false, null, "Invalid username or password");
        }
    }

    @Override
    public ResponseDTO register(UserRegisterDTO userRegisterData) {
        List<String> errorMessages = new ArrayList<>();
        List<String> messages = new ArrayList<>();
        try {
            if(userRegisterData.getUsername() == null || userRegisterData.getUsername().isBlank()) {
                errorMessages.add("Username cannot be empty");
            }

            if(userRegisterData.getEmail() == null || userRegisterData.getEmail().isBlank()) {
                errorMessages.add("Email cannot be empty");
            }

            if(userRegisterData.getPassword() == null || userRegisterData.getPassword().isBlank()) {
                errorMessages.add("Password cannot be empty");
            }

            if(userRegisterData.getConfirmPassword() == null || userRegisterData.getConfirmPassword().isBlank()) {
                errorMessages.add("Confirm password cannot be empty");
            }

            if (!errorMessages.isEmpty()) {
                return new ResponseDTO(false, null, errorMessages);
            }
            if (!userRegisterData.getPassword().equals(userRegisterData.getConfirmPassword())) {
                errorMessages.add("Password and Confirm Password fields do not match");
                return new ResponseDTO(false, null, errorMessages);
            }

            List<UserRepresentation> existingUsers = keycloakAdminClient.realm("myrealm")
                    .users()
                    .search(userRegisterData.getUsername(), 0, 1);

            if (!existingUsers.isEmpty()) {
                errorMessages.add("User with this username already exists");
                return new ResponseDTO(false, null, errorMessages);
            }

            // Създаване на потребителен обект
            UserRepresentation userRepresentation = new UserRepresentation();
            userRepresentation.setUsername(userRegisterData.getUsername());
            userRepresentation.setEmail(userRegisterData.getEmail());
            userRepresentation.setEnabled(true);
            userRepresentation.setEmailVerified(false);

            // Създаване на потребител в Keycloak
            Response response = keycloakAdminClient.realm("myrealm")
                    .users()
                    .create(userRepresentation);

            if (response.getStatus() != 201) {
                errorMessages.add("Failed to create user: HTTP " + response.getStatus());
                return new ResponseDTO(false, null, errorMessages);
            }

            // Получаване на userId
            String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");

            // Добавяне на парола
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(userRegisterData.getPassword());
            credential.setTemporary(false);

            keycloakAdminClient.realm("myrealm")
                    .users()
                    .get(userId)
                    .resetPassword(credential);
            messages.add("User registered successfully");
            return new ResponseDTO(true, messages, null);
        } catch (Exception e) {
            errorMessages.add("Error registering user: " + e.getMessage());
            return new ResponseDTO(false, null, errorMessages);
        }
    }
}