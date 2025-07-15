package com.example.gym_notes.service.impl;

import com.example.gym_notes.model.dto.*;
import com.example.gym_notes.model.entity.PersonalStatisticEntity;
import com.example.gym_notes.repository.PersonalStatisticsRepository;
import com.example.gym_notes.service.UserService;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    private final Keycloak keycloakAdminClient;
    private final PersonalStatisticsRepository personalStatisticsRepository;

    public UserServiceImpl(Keycloak keycloakAdminClient, PersonalStatisticsRepository personalStatisticsRepository) {
        this.keycloakAdminClient = keycloakAdminClient;
        this.personalStatisticsRepository = personalStatisticsRepository;
    }

    @Value("${keycloak.credentials.secret}")
    private String clientSecret;
    @Value("${keycloak.credentials.public-key}")
    private String publicKey;

    @Override
    public LoginResponseDTO login(UserLoginDTO loginData) {

                Keycloak keycloakLogin = KeycloakBuilder.builder()
                .serverUrl("http://host.docker.internal:8081")
                .realm("myrealm")
                .clientId("my-spring-app")
                .clientSecret(clientSecret)
                .username(loginData.getUsername())
                .password(loginData.getPassword())
                .grantType(OAuth2Constants.PASSWORD)
                .build();
//        локално
//        Keycloak keycloakLogin = KeycloakBuilder.builder()
//                .serverUrl("http://localhost:8081")
//                .realm("myrealm")
//                .clientId("my-spring-app")
//                .clientSecret("Fayi5BT1OtpV9sP2eYK8IsJszj2pqQsy")
//                .username(loginData.getUsername())
//                .password(loginData.getPassword())
//                .grantType(OAuth2Constants.PASSWORD)
//                .build();
        AccessTokenResponse tokenResponse = keycloakLogin.tokenManager().getAccessToken();
        return new LoginResponseDTO(true, tokenResponse, null);
    }

    @Override
    public ResponseDTO register(UserRegisterDTO userRegisterData) {
        List<String> errorMessages = new ArrayList<>();
        List<String> messages = new ArrayList<>();
        if (userRegisterData.getUsername() == null || userRegisterData.getUsername().isBlank()) {
            errorMessages.add("Username cannot be empty");
        }

        if (userRegisterData.getEmail() == null || userRegisterData.getEmail().isBlank()) {
            errorMessages.add("Email cannot be empty");
        }

        if (userRegisterData.getPassword() == null || userRegisterData.getPassword().isBlank()) {
            errorMessages.add("Password cannot be empty");
        }

        if (userRegisterData.getConfirmPassword() == null || userRegisterData.getConfirmPassword().isBlank()) {
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
        List<UserRepresentation> existingUsersByEmail = keycloakAdminClient.realm("myrealm")
                .users()
                .search(null, null, null, userRegisterData.getEmail(), 0, 1);
        if (!existingUsersByEmail.isEmpty()) {
            errorMessages.add("User with this email already exists");
            return new ResponseDTO(false, null, errorMessages);
        }

        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setUsername(userRegisterData.getUsername());
        userRepresentation.setEmail(userRegisterData.getEmail());
        userRepresentation.setEnabled(true);
        userRepresentation.setEmailVerified(false);

        Response response = keycloakAdminClient.realm("myrealm")
                .users()
                .create(userRepresentation);

        if (response.getStatus() != 201) {
            errorMessages.add("Failed to create user: HTTP " + response.getStatus());
            return new ResponseDTO(false, null, errorMessages);
        }

        String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(userRegisterData.getPassword());
        credential.setTemporary(false);

        keycloakAdminClient.realm("myrealm")
                .users()
                .get(userId)
                .resetPassword(credential);
        messages.add("User registered successfully");
        PersonalStatisticEntity personalStatisticEntity = new PersonalStatisticEntity();
        personalStatisticEntity.setUserId(UUID.fromString(userId));
        personalStatisticEntity.setUsername(userRegisterData.getUsername());
        personalStatisticEntity.setTotalSets(0);
        personalStatisticEntity.setTotalWorkouts(0);
        personalStatisticEntity.setTotalKgLifted(0);
        personalStatisticEntity.setTotalTimeTrained(0);
        personalStatisticEntity.setTotalDistance(0);
        this.personalStatisticsRepository.saveAndFlush(personalStatisticEntity);
        return new ResponseDTO(true, messages, null);
    }

    @Override
    public UserInfoDTO getUserInfo(UUID userId) {
        Optional<PersonalStatisticEntity> optionalPersonalStatistic = this.personalStatisticsRepository.findByUserId(userId);
        if(optionalPersonalStatistic.isEmpty()){
            return null;
        }
        UserInfoDTO userInfo = toUserInfoDTO(optionalPersonalStatistic.get());
        return userInfo;
    }

    @Override
    public Page<UserInfoDTO> getUsersInfosByUsernamePrefix(String beginWith, Pageable pageable) {
        return this.personalStatisticsRepository.findByUsernameStartingWith(beginWith, pageable).map(this::toUserInfoDTO);
    }

    @Override
    public LoginResponseDTO refresh(String refreshToken) {
        // build a **clean** WebClient—don’t let Spring Security’s OAuth2 filters
        // re-attach your (possibly expired) access token
        WebClient webClient = WebClient.builder()
                // if your Keycloak is on /auth, include it here; otherwise leave it off
                .baseUrl("http://localhost:8081")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .build();

        // form must include grant_type, refresh_token, client_id, client_secret
        MultiValueMap<String,String> form = new LinkedMultiValueMap<>();
        form.add("grant_type",    "refresh_token");
        form.add("refresh_token", refreshToken);
        form.add("client_id",     "my-spring-app");
        form.add("client_secret","Fayi5BT1OtpV9sP2eYK8IsJszj2pqQsy");

        try {
            AccessTokenResponse token = webClient.post()
                    .uri("/realms/myrealm/protocol/openid-connect/token")
                    .body(BodyInserters.fromFormData(form))
                    .retrieve()
                    .onStatus(
                            status -> status.value() == 401,
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(body -> Mono.error(new RuntimeException("Refresh failed (401): " + body)))
                    )
                    .bodyToMono(AccessTokenResponse.class)
                    .block();

            return new LoginResponseDTO(true, token, null);

        } catch (RuntimeException ex) {
            // you’ll see either “Refresh failed (401): …” or other errors
            return new LoginResponseDTO(false, null, ex.getMessage());
        }
    }


    @Override
    public LeaderboardDTO getLeaderboard() {
        LeaderboardDTO leaderboard = new LeaderboardDTO();

        Optional<PersonalStatisticEntity> topDistance = personalStatisticsRepository.findTopByOrderByTotalDistanceDesc();
        Optional<PersonalStatisticEntity> topSets = personalStatisticsRepository.findTopByOrderByTotalSetsDesc();
        Optional<PersonalStatisticEntity> topVolume = personalStatisticsRepository.findTopByOrderByTotalKgLiftedDesc();
        Optional<PersonalStatisticEntity> topDuration = personalStatisticsRepository.findTopByOrderByTotalTimeTrainedDesc();
        Optional<PersonalStatisticEntity> topWorkouts = personalStatisticsRepository.findTopByOrderByTotalWorkoutsDesc();

        topDistance.ifPresent(ps -> leaderboard.setMostDistance(new RecordDTO(ps.getUserId(), ps.getUsername(), ps.getTotalDistance())));
        topSets.ifPresent(ps -> leaderboard.setMostSets(new RecordDTO(ps.getUserId(), ps.getUsername(), ps.getTotalSets())));
        topVolume.ifPresent(ps -> leaderboard.setMostVolume(new RecordDTO(ps.getUserId(), ps.getUsername(), ps.getTotalKgLifted())));
        topDuration.ifPresent(ps -> leaderboard.setMostDuration(new RecordDTO(ps.getUserId(), ps.getUsername(), ps.getTotalTimeTrained())));
        topWorkouts.ifPresent(ps -> leaderboard.setMostWorkouts(new RecordDTO(ps.getUserId(), ps.getUsername(), ps.getTotalWorkouts())));

        return leaderboard;
    }

    private UserInfoDTO toUserInfoDTO(PersonalStatisticEntity personalStatistic) {
        UserInfoDTO userInfo = new UserInfoDTO();
        userInfo.setId(personalStatistic.getUserId());
        userInfo.setName(personalStatistic.getUsername());
        userInfo.setDistance(personalStatistic.getTotalDistance());
        userInfo.setSets(personalStatistic.getTotalSets());
        userInfo.setWorkouts(personalStatistic.getTotalWorkouts());
        userInfo.setDuration(personalStatistic.getTotalTimeTrained());
        userInfo.setVolume(personalStatistic.getTotalKgLifted());
        return userInfo;
    }
}