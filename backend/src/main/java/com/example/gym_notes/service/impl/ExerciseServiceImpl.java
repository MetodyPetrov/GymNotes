package com.example.gym_notes.service.impl;

import com.example.gym_notes.mapper.ExerciseMapper;
import com.example.gym_notes.model.dto.ExerciseCreateDTO;
import com.example.gym_notes.model.dto.ExerciseDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.entity.ExerciseEntity;
import com.example.gym_notes.model.entity.WorkoutTypeEntity;
import com.example.gym_notes.model.enums.WorkoutType;
import com.example.gym_notes.repository.ExerciseRepository;
import com.example.gym_notes.repository.WorkoutTypeRepository;
import com.example.gym_notes.service.ExerciseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

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
    public ResponseDTO saveExercise(ExerciseCreateDTO exerciseCreateData, UUID userId) {
        List<String> errorMessages = new ArrayList<>();
        List<String> messages = new ArrayList<>();

        ExerciseEntity exercise = exerciseMapper.toEntity(exerciseCreateData);
        List<WorkoutTypeEntity> workoutTypes = new ArrayList<>();
        for (String workoutTag : exerciseCreateData.getWorkoutTags()) {
            if(!Arrays.stream(WorkoutType.values()).anyMatch(type -> type.name().equals(workoutTag.toUpperCase()))){
                errorMessages.add("This tag does not exist: " + workoutTag);
                return new ResponseDTO(false, null, errorMessages);
            }
            Optional<WorkoutTypeEntity> byType = this.workoutTypeRepository.findByType(WorkoutType.valueOf(workoutTag.toUpperCase()));
            workoutTypes.add(byType.get());
        }
        if(this.exerciseRepository.findByName(exerciseCreateData.getName()).isPresent()){
            errorMessages.add("This exercise already exists: " + exerciseCreateData.getName());
            return new ResponseDTO(false, null, errorMessages);
        }
        exercise.setWorkoutTypes(workoutTypes);
        exercise.setCreatorUserId(userId);
        this.exerciseRepository.saveAndFlush(exercise);
        messages.add("Exercise created successfully");
        return new ResponseDTO(true, messages, null);

    }

    @Override
    public Page<ExerciseDTO> getAllExercises(Pageable pageable) {
        return exerciseRepository
                .findAll(pageable)
                .map(exerciseEntity -> {
                    ExerciseDTO dto = exerciseMapper.toExerciseDto(exerciseEntity);
                    List<String> tags = exerciseEntity.getWorkoutTypes()
                            .stream()
                            .map(wt -> wt.getType().name().toLowerCase())
                            .toList();
                    dto.setTags(tags);
                    return dto;
                });
    }
}