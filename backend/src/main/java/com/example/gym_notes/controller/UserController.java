package com.example.gym_notes.controller;

import com.example.gym_notes.model.dto.*;
import com.example.gym_notes.pagination.OffsetBasedPageRequest;
import com.example.gym_notes.service.UserService;
import com.example.gym_notes.service.WorkoutService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
public class UserController {
    private final UserService userService;
    private final WorkoutService workoutService;

    public UserController(UserService userService, WorkoutService workoutService) {
        this.userService = userService;
        this.workoutService = workoutService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody UserLoginDTO loginData) {
        try{
            LoginResponseDTO loginResponseDTO = this.userService.login(loginData);
            if(loginResponseDTO.isSuccess()){
                return ResponseEntity.ok(loginResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new LoginResponseDTO(false, null, "Invalid username or password"));
        }
    }
    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> register(@RequestBody UserRegisterDTO userRegisterData) {
        try{
            ResponseDTO registerResponseDTO = this.userService.register(userRegisterData);
            if(registerResponseDTO.isSuccess()){
                return ResponseEntity.ok(registerResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(registerResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error register user: " + e.getMessage())));
        }
    }
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponseDTO> refresh(@RequestParam String refreshToken) {
        LoginResponseDTO refreshResponse = userService.refresh(refreshToken);
        if (refreshResponse.isSuccess()) {
            return ResponseEntity.ok(refreshResponse);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(refreshResponse);
        }
    }
    @GetMapping("/profiles/user/info")
    public ResponseEntity<UserInfoDTO> getUserInfo(@RequestParam(required = false) UUID id, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            if(id != null){
                userId = id;
            }
            UserInfoDTO userInfo = this.userService.getUserInfo(userId);
            return ResponseEntity.ok().body(userInfo);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @GetMapping("/profiles")
    public ResponseEntity<Page<UserInfoDTO>> getUsersInfos(@RequestParam("beginWith") String beginWith,
                                                           @RequestParam(defaultValue = "0") Integer offset,
                                                           @RequestParam(defaultValue = "10") Integer limit){
        try {
            Pageable pageable = new OffsetBasedPageRequest(offset, limit, Sort.by("username").ascending());
            Page<UserInfoDTO> usersPage = userService.getUsersInfosByUsernamePrefix(beginWith, pageable);
            return ResponseEntity.ok(usersPage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @GetMapping("/leaderboard")
    public ResponseEntity<LeaderboardDTO> getLeaderboard(){
        try {
            return ResponseEntity.ok().body(this.userService.getLeaderboard());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}