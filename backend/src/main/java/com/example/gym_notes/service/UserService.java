package com.example.gym_notes.service;

import com.example.gym_notes.model.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;


public interface UserService {
    LoginResponseDTO login(UserLoginDTO loginData);
    ResponseDTO register(UserRegisterDTO userRegisterData);
    UserInfoDTO getUserInfo(UUID userId);
    Page<UserInfoDTO> getUsersInfosByUsernamePrefix(String beginWith, Pageable pageable);
    LoginResponseDTO refresh(String refreshToken);
    LeaderboardDTO getLeaderboard();
}
