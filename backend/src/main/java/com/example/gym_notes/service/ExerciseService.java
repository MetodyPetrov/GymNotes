package com.example.gym_notes.service;

import com.example.gym_notes.model.dto.ExerciseCreateDTO;
import com.example.gym_notes.model.dto.ResponseDTO;

public interface ExerciseService {
    ResponseDTO saveExercise(ExerciseCreateDTO exerciseCreateData);
}
