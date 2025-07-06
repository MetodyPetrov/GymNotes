package com.example.gym_notes.controller;

import com.example.gym_notes.model.dto.ExerciseCreateDTO;
import com.example.gym_notes.model.dto.ExerciseDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.service.ExerciseService;
import com.example.gym_notes.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ExerciseController {
    private final ExerciseService exerciseService;
    private final UserService userService;

    public ExerciseController(ExerciseService exerciseService, UserService userService) {
        this.exerciseService = exerciseService;
        this.userService = userService;
    }
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/create/exercise")
    public ResponseEntity<ResponseDTO> createExercise(@RequestBody ExerciseCreateDTO exerciseCreateData){
        try{
            String usernameByAccessToken = this.userService.getUsernameByAccessToken(exerciseCreateData.getAccessToken());
            ResponseDTO createExerciseResponseDTO = this.exerciseService.saveExercise(exerciseCreateData, usernameByAccessToken);
            if(createExerciseResponseDTO.isSuccess()){
                return ResponseEntity.ok(createExerciseResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(createExerciseResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error creating exercise: " + e.getMessage())));
        }
    }
    @GetMapping("/all/exercises")
    public ResponseEntity<List<ExerciseDTO>> getAllExercises(){
        try {
            List<ExerciseDTO> allExercises = this.exerciseService.getAllExercises();
            return ResponseEntity.ok(allExercises);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}