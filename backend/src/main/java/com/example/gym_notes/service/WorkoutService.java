package com.example.gym_notes.service;

import com.example.gym_notes.model.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

public interface WorkoutService {
    ResponseDTO createWorkout(WorkoutCreateDTO workoutCreateData, UUID userId);
//    ResponseDTO deleteExerciseFromWorkout(Integer workoutId, Integer exerciseId);
//    ResponseDTO addExerciseToWorkout(Integer workoutId, WorkoutExerciseDTO workoutExerciseData);
    ResponseDTO likeWorkout(UUID workoutId, UUID userId);
    ResponseDTO removeLikeFromWorkout(UUID workoutId, UUID userId);
    ResponseDTO dislikeWorkout(UUID workoutId, UUID userId);
    ResponseDTO removeDislikeFromWorkout(UUID workoutId, UUID userId);
    List<WorkoutInfoDTO> getAllWorkoutsForUser(UUID userId, Pageable pageable);
    List<WorkoutInfoDTO> getAllWorkoutsForUserByDateCreated(UUID userId, Timestamp dateCreated, Pageable pageable);
    ResponseDTO addNewComment (UUID workoutId, UUID userId, AddCommentDTO addCommentData);
    ResponseDTO editComment(UUID commentId, UUID userId, EditCommentDTO editCommentData);
    List<CommentInfoDTO> getAllCommentsForWorkout (UUID workoutId);
    //UUID getWorkoutCreatorById (UUID workoutId);
}
