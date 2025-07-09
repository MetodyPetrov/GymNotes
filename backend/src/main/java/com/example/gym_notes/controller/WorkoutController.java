package com.example.gym_notes.controller;

import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.WorkoutCreateDTO;
import com.example.gym_notes.model.dto.WorkoutExerciseDTO;
import com.example.gym_notes.service.WorkoutService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/create/workout")
    public ResponseEntity<ResponseDTO> createWorkout(@RequestBody WorkoutCreateDTO workoutCreateData, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            ResponseDTO createWorkoutResponseDTO = this.workoutService.createWorkout(workoutCreateData, userId);
            if(createWorkoutResponseDTO.isSuccess()){
                return ResponseEntity.ok(createWorkoutResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(createWorkoutResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error creating workout: " + e.getMessage())));
        }
    }
//    @DeleteMapping("/workouts/{workoutId}/exercises/{exerciseId}")
//    public ResponseEntity<ResponseDTO> deleteExerciseFromWorkout(@PathVariable Integer workoutId, @PathVariable Integer exerciseId) {
//        try{
//
//            ResponseDTO deleteExerciseFromWorkoutResponseDTO = this.workoutService.deleteExerciseFromWorkout(workoutId, exerciseId);
//            if(deleteExerciseFromWorkoutResponseDTO.isSuccess()){
//                return ResponseEntity.ok(deleteExerciseFromWorkoutResponseDTO);
//            }else{
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(deleteExerciseFromWorkoutResponseDTO);
//            }
//        }catch (Exception e){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error deleting exercise: " + e.getMessage())));
//        }
//    }
//    @PostMapping("/workouts/{workoutId}/add/exercise")
//    public ResponseEntity<ResponseDTO> addExercisesToWorkout(@PathVariable Integer workoutId, @RequestBody WorkoutExerciseDTO workoutExerciseData){
//        try{
//            ResponseDTO addExerciseToWorkoutResponseDTO = this.workoutService.addExerciseToWorkout(workoutId, workoutExerciseData);
//            if(addExerciseToWorkoutResponseDTO.isSuccess()){
//                return ResponseEntity.ok(addExerciseToWorkoutResponseDTO);
//            }else{
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(addExerciseToWorkoutResponseDTO);
//            }
//        }catch (Exception e){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error deleting exercise: " + e.getMessage())));
//        }
//    }
}