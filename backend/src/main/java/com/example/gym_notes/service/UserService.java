package com.example.gym_notes.service;

import com.example.gym_notes.model.dto.LoginResponseDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.UserLoginDTO;
import com.example.gym_notes.model.dto.UserRegisterDTO;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;


public interface UserService {
    LoginResponseDTO login(UserLoginDTO loginData);
    ResponseDTO register(UserRegisterDTO userRegisterData);
    String getUsernameByAccessToken(String accessToken) throws NoSuchAlgorithmException, InvalidKeySpecException;
}
