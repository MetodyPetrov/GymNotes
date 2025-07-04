package com.example.gym_notes.controller;

import com.example.gym_notes.model.dto.ExerciseCreateDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.service.ExerciseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExerciseController {
    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @PostMapping("/create/exercise")
    public ResponseEntity<?> createExercise(@RequestBody ExerciseCreateDTO exerciseCreateData){
        this.exerciseService.saveExercise(exerciseCreateData);
        return ResponseEntity.ok("test");
    }
}
