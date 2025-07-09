package com.example.gym_notes.service.impl;

import com.example.gym_notes.mapper.SetMapper;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.SetDTO;
import com.example.gym_notes.model.dto.WorkoutCreateDTO;
import com.example.gym_notes.model.dto.WorkoutExerciseDTO;
import com.example.gym_notes.model.entity.ExerciseEntity;
import com.example.gym_notes.model.entity.PersonalStatisticEntity;
import com.example.gym_notes.model.entity.SetEntity;
import com.example.gym_notes.model.entity.WorkoutEntity;
import com.example.gym_notes.repository.ExerciseRepository;
import com.example.gym_notes.repository.PersonalStatisticsRepository;
import com.example.gym_notes.repository.SetRepository;
import com.example.gym_notes.repository.WorkoutRepository;
import com.example.gym_notes.service.WorkoutService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;
    private final PersonalStatisticsRepository personalStatisticsRepository;
    private final SetRepository setRepository;
    private final SetMapper setMapper;

    public WorkoutServiceImpl(WorkoutRepository workoutRepository, ExerciseRepository exerciseRepository, PersonalStatisticsRepository personalStatisticsRepository, SetRepository setRepository, SetMapper setMapper) {
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
        this.personalStatisticsRepository = personalStatisticsRepository;
        this.setRepository = setRepository;
        this.setMapper = setMapper;
    }

    @Override
    public ResponseDTO createWorkout(WorkoutCreateDTO workoutCreateData, UUID userId) {
        Optional<PersonalStatisticEntity> optionalPersonalStatisticEntity = this.personalStatisticsRepository.findByUserId(userId);
        if(optionalPersonalStatisticEntity.isEmpty()){
            return new ResponseDTO(true, null, List.of("There is no user with this id: " + userId));
        }
        WorkoutEntity workoutEntity = new WorkoutEntity();
        workoutEntity.setId(workoutCreateData.getId());
        workoutEntity.setCreatorUserId(userId);
        workoutEntity.setDateCreated(Timestamp.valueOf(LocalDateTime.now()));
        List<SetEntity> setEntityList = new ArrayList<>();
        for (WorkoutExerciseDTO exerciseDTO : workoutCreateData.getExercises()) {
            Optional<ExerciseEntity> optionalExerciseEntity = this.exerciseRepository.findByName(exerciseDTO.getName());
            if(optionalExerciseEntity.isEmpty()){
                return new ResponseDTO(true, null, List.of("No such exercise: " + exerciseDTO.getName()));
            }
            setEntityList.addAll(getSetEntitiesByWorkoutExerciseDTO(exerciseDTO, workoutEntity, optionalExerciseEntity.get()));
        }
        workoutEntity.setSets(setEntityList);
        workoutRepository.saveAndFlush(workoutEntity);
        PersonalStatisticEntity personalStatisticEntity = optionalPersonalStatisticEntity.get();
        personalStatisticEntity.setTotalWorkouts(personalStatisticEntity.getTotalWorkouts()+ 1);
        this.personalStatisticsRepository.saveAndFlush(personalStatisticEntity);
        return new ResponseDTO(true, List.of("Workout created successfully"), null);
    }
//  @Transactional
//    @Override
//    public ResponseDTO deleteExerciseFromWorkout(Integer workoutId, Integer exerciseId) {
//        if(!this.workoutRepository.existsById(workoutId)){
//            return new ResponseDTO(true, null, List.of("No such workout with thi id: " + workoutId));
//
//        }
//        if(!this.exerciseRepository.existsById(exerciseId)){
//            return new ResponseDTO(true, null, List.of("No such exercise with this id: " + exerciseId));
//
//        }
//        this.setRepository.deleteAllByWorkoutIdAndExerciseId(workoutId, exerciseId);
//        return new ResponseDTO(true, List.of("Exercise deleted successfully"), null);
//    }
//
//    @Override
//    public ResponseDTO addExerciseToWorkout(Integer workoutId, WorkoutExerciseDTO workoutExerciseData) {
//        Optional<WorkoutEntity> optionalWorkoutEntity = this.workoutRepository.findById(workoutId);
//        if(optionalWorkoutEntity.isEmpty()){
//            return new ResponseDTO(true, null, List.of("No such workout with this id: " + workoutId));
//        }
//        Optional<ExerciseEntity> optionalExerciseEntity = this.exerciseRepository.findByName(workoutExerciseData.getName());
//        if(optionalExerciseEntity.isEmpty()){
//            return new ResponseDTO(true, null, List.of("No such exercise: " + workoutExerciseData.getName()));
//        }
//        List<SetEntity> setEntityList = getSetEntitiesByWorkoutExerciseDTO(workoutExerciseData, optionalWorkoutEntity.get(), optionalExerciseEntity.get());
//        this.setRepository.saveAllAndFlush(setEntityList);
//        return new ResponseDTO(true, List.of("Exercise added successfully"), null);
//    }

    private List<SetEntity> getSetEntitiesByWorkoutExerciseDTO(WorkoutExerciseDTO exerciseDTO, WorkoutEntity workoutEntity, ExerciseEntity exerciseEntity){
        List<SetEntity> setEntityList = new ArrayList<>();
        for (SetDTO setDTO : exerciseDTO.getSets()) {
            SetEntity currentSet = setMapper.toEntity(setDTO);
            currentSet.setExercise(exerciseEntity);
            currentSet.setWorkout(workoutEntity);
            setEntityList.add(currentSet);
        }
        return setEntityList;
    }
}