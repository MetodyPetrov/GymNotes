package com.example.gym_notes.controller;

import com.example.gym_notes.model.dto.LoginResponseDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.UserLoginDTO;
import com.example.gym_notes.model.dto.UserRegisterDTO;
import com.example.gym_notes.service.UserService;
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
    public ResponseEntity<LoginResponseDTO> login(@RequestBody UserLoginDTO loginData) {
        LoginResponseDTO loginResponseDTO = this.userService.login(loginData);
        if(loginResponseDTO.isSuccess()){
            return ResponseEntity.ok(loginResponseDTO);
        }else{
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginResponseDTO);
        }
    }
    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> register(@RequestBody UserRegisterDTO userRegisterData) {
        ResponseDTO registerResponseDTO = this.userService.register(userRegisterData);
        if(registerResponseDTO.isSuccess()){
            return ResponseEntity.ok(registerResponseDTO);
        }else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(registerResponseDTO);
        }
    }
}