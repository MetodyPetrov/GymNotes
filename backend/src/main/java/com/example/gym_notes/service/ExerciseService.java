package com.example.gym_notes.service;

import com.example.gym_notes.model.dto.ExerciseCreateDTO;
import com.example.gym_notes.model.dto.ExerciseDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import org.apache.james.mime4j.io.LimitedInputStream;

import java.util.List;
import java.util.UUID;

public interface ExerciseService {
    ResponseDTO saveExercise(ExerciseCreateDTO exerciseCreateData, UUID userId);
    List<ExerciseDTO> getAllExercises();
}
