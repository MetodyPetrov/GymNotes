package com.example.gym_notes.service;

import com.example.gym_notes.model.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.util.UUID;


public interface UserService {
    LoginResponseDTO login(UserLoginDTO loginData);
    ResponseDTO register(UserRegisterDTO userRegisterData);
    //String getUsernameByAccessToken(String accessToken) throws NoSuchAlgorithmException, InvalidKeySpecException;
    UserInfoDTO getUserInfo(UUID userId);
    Page<UserInfoDTO> getUsersInfosByUsernamePrefix(String beginWith, Pageable pageable);
    LoginResponseDTO refresh(String refreshToken);
    LeaderboardDTO getLeaderboard();
}
