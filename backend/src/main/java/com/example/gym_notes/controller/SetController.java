package com.example.gym_notes.controller;

import com.example.gym_notes.model.dto.EditSetDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.SetDTO;
import com.example.gym_notes.model.dto.WorkoutExerciseDTO;
import com.example.gym_notes.service.SetService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class SetController {
    private final SetService setService;

    public SetController(SetService setService) {
        this.setService = setService;
    }

    @PostMapping("/workouts/{workoutId}/exercises/{exerciseId}/add/set")
    public ResponseEntity<ResponseDTO> addSetToExerciseFromWorkout(@PathVariable UUID workoutId, @PathVariable UUID exerciseId, @RequestBody SetDTO setData, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            ResponseDTO addSetToExerciseFromWorkoutResponseDTO = this.setService.addSetToExerciseFromWorkout(workoutId, exerciseId, setData, userId);
            if(addSetToExerciseFromWorkoutResponseDTO.isSuccess()){
                return ResponseEntity.ok(addSetToExerciseFromWorkoutResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(addSetToExerciseFromWorkoutResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error adding set: " + e.getMessage())));
        }
    }
    @DeleteMapping("/sets/{setId}")
    public ResponseEntity<ResponseDTO> deleteSet(@PathVariable UUID setId, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            ResponseDTO deleteSetResponseDTO = this.setService.deleteSetById(setId, userId);
            if(deleteSetResponseDTO.isSuccess()){
                return ResponseEntity.ok(deleteSetResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(deleteSetResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error deleting set: " + e.getMessage())));
        }
    }
    @PutMapping("/sets")
    public ResponseEntity<ResponseDTO> updateSet(@RequestBody EditSetDTO setData, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            ResponseDTO updateSetResponseDTO = this.setService.updateSetById(setData, userId);
            if(updateSetResponseDTO.isSuccess()){
                return ResponseEntity.ok(updateSetResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(updateSetResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error updating set: " + e.getMessage())));
        }
    }
}
