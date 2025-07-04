package com.example.gym_notes.service;

import com.example.gym_notes.model.dto.LoginResponseDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.UserLoginDTO;
import com.example.gym_notes.model.dto.UserRegisterDTO;


public interface UserService {
    LoginResponseDTO login(UserLoginDTO loginData);
    ResponseDTO register(UserRegisterDTO userRegisterData);
}
