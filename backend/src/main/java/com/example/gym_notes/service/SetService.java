package com.example.gym_notes.service;

import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.SetDTO;

import java.util.UUID;

public interface SetService {
    ResponseDTO addSetToExerciseFromWorkout(Integer workoutId, Integer exerciseId, SetDTO setData, UUID userId);
    ResponseDTO deleteSetById(Integer setId, UUID userId);
    ResponseDTO updateSetById(SetDTO setData, UUID userId);
}
