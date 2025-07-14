package com.example.gym_notes.service;

import com.example.gym_notes.model.dto.ExerciseCreateDTO;
import com.example.gym_notes.model.dto.ExerciseDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import org.apache.james.mime4j.io.LimitedInputStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ExerciseService {
    ResponseDTO saveExercise(ExerciseCreateDTO exerciseCreateData, UUID userId);
    Page<ExerciseDTO> getAllExercises(Pageable pageable);
}
