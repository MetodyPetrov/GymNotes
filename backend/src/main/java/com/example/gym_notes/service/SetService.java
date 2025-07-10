package com.example.gym_notes.service;

import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.SetDTO;

import java.util.UUID;

public interface SetService {
    ResponseDTO addSetToExerciseFromWorkout(UUID workoutId, UUID exerciseId, SetDTO setData, UUID userId);
    ResponseDTO deleteSetById(UUID setId, UUID userId);
    ResponseDTO updateSetById(SetDTO setData, UUID userId);
}
