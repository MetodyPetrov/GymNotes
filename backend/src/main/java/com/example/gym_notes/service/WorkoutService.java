package com.example.gym_notes.service;

import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.WorkoutCreateDTO;
import com.example.gym_notes.model.dto.WorkoutExerciseDTO;

import java.util.UUID;

public interface WorkoutService {
    ResponseDTO createWorkout(WorkoutCreateDTO workoutCreateData, UUID userId);
//    ResponseDTO deleteExerciseFromWorkout(Integer workoutId, Integer exerciseId);
//    ResponseDTO addExerciseToWorkout(Integer workoutId, WorkoutExerciseDTO workoutExerciseData);
    ResponseDTO likeWorkout(UUID workoutId, UUID userId);
    ResponseDTO removeLikeFromWorkout(UUID workoutId, UUID userId);
    ResponseDTO dislikeWorkout(UUID workoutId, UUID userId);
    ResponseDTO removeDislikeFromWorkout(UUID workoutId, UUID userId);
}
