package com.example.gym_notes.controller;

import com.example.gym_notes.model.dto.ExerciseCreateDTO;
import com.example.gym_notes.model.dto.ExerciseDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.service.ExerciseService;
import com.example.gym_notes.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
public class ExerciseController {
    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/create/exercise")
    public ResponseEntity<ResponseDTO> createExercise(@RequestBody ExerciseCreateDTO exerciseCreateData, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            ResponseDTO createExerciseResponseDTO = this.exerciseService.saveExercise(exerciseCreateData, userId);
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