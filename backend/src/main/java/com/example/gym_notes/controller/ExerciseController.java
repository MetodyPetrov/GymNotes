package com.example.gym_notes.controller;

import com.example.gym_notes.model.dto.ExerciseCreateDTO;
import com.example.gym_notes.model.dto.ExerciseDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.pagination.OffsetBasedPageRequest;
import com.example.gym_notes.service.ExerciseService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class ExerciseController {
    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    @PostMapping("/exercises/new")
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
    @GetMapping("/exercises")
    public ResponseEntity<Page<ExerciseDTO>> getAllExercises(@RequestParam(defaultValue = "0") Integer offset,
                                                             @RequestParam(defaultValue = "10") Integer limit){
        try {
            Pageable pageable = new OffsetBasedPageRequest(offset, limit, Sort.by("name").ascending());
            Page<ExerciseDTO> exercisesPage = this.exerciseService.getAllExercises(pageable);
            return ResponseEntity.ok(exercisesPage);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}