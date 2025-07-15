package com.example.gym_notes.controller;

import com.example.gym_notes.model.dto.*;
import com.example.gym_notes.pagination.OffsetBasedPageRequest;
import com.example.gym_notes.service.UserService;
import com.example.gym_notes.service.WorkoutService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
public class WorkoutController {

    private final WorkoutService workoutService;
    private final UserService userService;

    public WorkoutController(WorkoutService workoutService, UserService userService) {
        this.workoutService = workoutService;
        this.userService = userService;
    }

    @PostMapping("/workouts/new")
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
    @PatchMapping("/workouts/{workoutId}/likes/new")
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
    @PatchMapping("/workouts/{workoutId}/likes/delete")
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
    @PatchMapping("/workouts/{workoutId}/dislikes/new")
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
    @PatchMapping("/workouts/{workoutId}/dislikes/delete")
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
    @GetMapping("/workouts/list")
    public ResponseEntity<Page<WorkoutInfoDTO>> getAllWorkoutsForUser(@RequestParam(required = false) UUID id, @RequestParam(required = false)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, @RequestParam(defaultValue = "0") Integer offset, @RequestParam(defaultValue = "10") Integer limit, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            if(id != null){
                userId = id;
            }
            Pageable pageable = new OffsetBasedPageRequest(offset, limit, Sort.by("dateCreated").ascending());
            Page<WorkoutInfoDTO> allWorkouts;
            if(date == null){
                allWorkouts = this.workoutService.getAllWorkoutsForUser(userId, pageable);
            }else{
                LocalDateTime startOfDay = date.atStartOfDay();
                LocalDateTime startNextDay = date.plusDays(1).atStartOfDay();
                Timestamp timestampFrom = Timestamp.valueOf(startOfDay);
                Timestamp timestampTo   = Timestamp.valueOf(startNextDay);

                allWorkouts = this.workoutService.getAllWorkoutsForUserByDateCreated(userId, timestampFrom, timestampTo, pageable);
            }

            return ResponseEntity.ok(allWorkouts);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @PostMapping("/workouts/comments/new")
    public ResponseEntity<ResponseDTO> addNewComment(@RequestBody AddCommentDTO addCommentData, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            ResponseDTO addNewCommentResponseDTO = this.workoutService.addNewComment(addCommentData.getWorkoutID(), userId, addCommentData);
            if(addNewCommentResponseDTO.isSuccess()){
                return ResponseEntity.ok(addNewCommentResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(addNewCommentResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error adding comment to workout: " + e.getMessage())));
        }
    }
    @PatchMapping("/workouts/comments/edit")
    public ResponseEntity<ResponseDTO> editComment(@RequestBody EditCommentDTO editCommentData, HttpServletRequest request){
        try{
            UUID userId = (UUID) request.getAttribute("userId");
            ResponseDTO editCommentResponseDTO = this.workoutService.editComment(editCommentData.getCommentId(), userId, editCommentData);
            if(editCommentResponseDTO.isSuccess()){
                return ResponseEntity.ok(editCommentResponseDTO);
            }else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(editCommentResponseDTO);
            }
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO(false, null, List.of("Error editing comment")));
        }
    }

    @GetMapping("/workouts/comments")
    public ResponseEntity<List<CommentInfoDTO>> getAllCommentsForWorkout(@RequestParam UUID workoutId){
        try{
            List<CommentInfoDTO> allCommentsForWorkout = this.workoutService.getAllCommentsForWorkout(workoutId);
            for (int i = 0; i < allCommentsForWorkout.size(); i++) {
                CommentInfoDTO currentCommentInfo = allCommentsForWorkout.get(i);
                UserInfoDTO userInfo = this.userService.getUserInfo(currentCommentInfo.getOwnerId());
                currentCommentInfo.setOwner(userInfo.getName());
            }
            return ResponseEntity.ok().body(allCommentsForWorkout);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
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