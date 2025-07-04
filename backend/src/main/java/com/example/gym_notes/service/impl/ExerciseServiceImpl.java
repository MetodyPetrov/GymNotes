package com.example.gym_notes.service.impl;

import com.example.gym_notes.mapper.ExerciseMapper;
import com.example.gym_notes.model.dto.ExerciseCreateDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.entity.ExerciseEntity;
import com.example.gym_notes.model.entity.WorkoutTypeEntity;
import com.example.gym_notes.model.enums.WorkoutType;
import com.example.gym_notes.repository.ExerciseRepository;
import com.example.gym_notes.repository.WorkoutTypeRepository;
import com.example.gym_notes.service.ExerciseService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ExerciseServiceImpl implements ExerciseService {
    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;
    private final WorkoutTypeRepository workoutTypeRepository;

    public ExerciseServiceImpl(ExerciseRepository exerciseRepository, ExerciseMapper exerciseMapper, WorkoutTypeRepository workoutTypeRepository) {
        this.exerciseRepository = exerciseRepository;
        this.exerciseMapper = exerciseMapper;
        this.workoutTypeRepository = workoutTypeRepository;
    }

    @Override
    public ResponseDTO saveExercise(ExerciseCreateDTO exerciseCreateData) {
        ExerciseEntity exercise = exerciseMapper.toEntity(exerciseCreateData);
        List<WorkoutTypeEntity> workoutTypes = new ArrayList<>();
        for (String workoutTag : exerciseCreateData.getWorkoutTags()) {
            Optional<WorkoutTypeEntity> byType = this.workoutTypeRepository.findByType(WorkoutType.valueOf(workoutTag));
            workoutTypes.add(byType.get());
        }
        exercise.setWorkoutTypes(workoutTypes);
        this.exerciseRepository.saveAndFlush(exercise);
        return null;
    }
}