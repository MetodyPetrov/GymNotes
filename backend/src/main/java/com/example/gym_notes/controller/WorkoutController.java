package com.example.gym_notes.controller;

import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.WorkoutCreateDTO;
import com.example.gym_notes.service.WorkoutService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

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
    @PostMapping("/workouts/{workoutId}/likes/new")
    public ResponseEntity<ResponseDTO> likeWorkout(@PathVariable UUID workoutId, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            ResponseDTO likeWorkoutResponseDTO = this.workoutService.likeWorkout(workoutId, userId);
            if(likeWorkoutResponseDTO.isSuccess()){
                return ResponseEntity.ok(likeWorkoutResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(likeWorkoutResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error liking workout: " + e.getMessage())));
        }
    }
    @PostMapping("/workouts/{workoutId}/likes/delete")
    public ResponseEntity<ResponseDTO> removeLikeFromWorkout(@PathVariable UUID workoutId, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            ResponseDTO deleteLikeFromWorkoutResponseDTO = this.workoutService.removeLikeFromWorkout(workoutId, userId);
            if(deleteLikeFromWorkoutResponseDTO.isSuccess()){
                return ResponseEntity.ok(deleteLikeFromWorkoutResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(deleteLikeFromWorkoutResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error removing like from workout: " + e.getMessage())));
        }
    }
    @PostMapping("/workouts/{workoutId}/dislikes/new")
    public ResponseEntity<ResponseDTO> dislikeWorkout(@PathVariable UUID workoutId, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            ResponseDTO dislikeWorkoutResponseDTO = this.workoutService.dislikeWorkout(workoutId, userId);
            if(dislikeWorkoutResponseDTO.isSuccess()){
                return ResponseEntity.ok(dislikeWorkoutResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(dislikeWorkoutResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error liking workout: " + e.getMessage())));
        }
    }
    @PostMapping("/workouts/{workoutId}/dislikes/delete")
    public ResponseEntity<ResponseDTO> removeDislikeFromWorkout(@PathVariable UUID workoutId, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            ResponseDTO deleteLikeFromWorkoutResponseDTO = this.workoutService.removeDislikeFromWorkout(workoutId, userId);
            if(deleteLikeFromWorkoutResponseDTO.isSuccess()){
                return ResponseEntity.ok(deleteLikeFromWorkoutResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(deleteLikeFromWorkoutResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error removing like from workout: " + e.getMessage())));
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