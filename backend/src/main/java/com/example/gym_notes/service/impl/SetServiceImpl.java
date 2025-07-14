package com.example.gym_notes.service.impl;

import com.example.gym_notes.mapper.SetMapper;
import com.example.gym_notes.model.dto.EditSetDTO;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.SetDTO;
import com.example.gym_notes.model.entity.ExerciseEntity;
import com.example.gym_notes.model.entity.PersonalStatisticEntity;
import com.example.gym_notes.model.entity.SetEntity;
import com.example.gym_notes.model.entity.WorkoutEntity;
import com.example.gym_notes.repository.ExerciseRepository;
import com.example.gym_notes.repository.PersonalStatisticsRepository;
import com.example.gym_notes.repository.SetRepository;
import com.example.gym_notes.repository.WorkoutRepository;
import com.example.gym_notes.service.SetService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SetServiceImpl implements SetService {
    private final SetRepository setRepository;
    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;
    private final PersonalStatisticsRepository personalStatisticsRepository;
    private final SetMapper setMapper;

    public SetServiceImpl(SetRepository setRepository, WorkoutRepository workoutRepository, ExerciseRepository exerciseRepository, PersonalStatisticsRepository personalStatisticsRepository, SetMapper setMapper) {
        this.setRepository = setRepository;
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
        this.personalStatisticsRepository = personalStatisticsRepository;
        this.setMapper = setMapper;
    }

    @Override
    public ResponseDTO addSetToExerciseFromWorkout(UUID workoutId, UUID exerciseId, SetDTO setData, UUID userId) {
        Optional<WorkoutEntity> optionalWorkoutEntity = this.workoutRepository.findById(workoutId);
        if(optionalWorkoutEntity.isEmpty()){
            return new ResponseDTO(false, null, List.of("No such workout with this id: " + workoutId));
        }
        if(!optionalWorkoutEntity.get().getCreatorUserId().equals(userId)){
            return new ResponseDTO(false, null, List.of("You do not have permission to add a set to someone else’s workout"));
        }
        Optional<ExerciseEntity> optionalExerciseEntity = this.exerciseRepository.findById(exerciseId);
        if(optionalExerciseEntity.isEmpty()){
            return new ResponseDTO(false, null, List.of("No such exercise with this id: " + exerciseId));
        }
        Optional<PersonalStatisticEntity> optionalPersonalStatisticEntity = this.personalStatisticsRepository.findByUserId(optionalWorkoutEntity.get().getCreatorUserId());
        if(optionalPersonalStatisticEntity.isEmpty()){
            return new ResponseDTO(false, null, List.of("There is no user with user id: " + optionalWorkoutEntity.get().getCreatorUserId() + " which is the id of workout creator"));
        }
        ExerciseEntity exerciseEntity = optionalExerciseEntity.get();
        PersonalStatisticEntity personalStatisticEntity = optionalPersonalStatisticEntity.get();

        ResponseDTO responseDTO = checkSetProperties(exerciseEntity, setData);
        if(responseDTO != null){
            return responseDTO;
        }

        SetEntity setEntity = setMapper.toEntity(setData);
        setEntity.setWorkout(optionalWorkoutEntity.get());
        setEntity.setExercise(exerciseEntity);
        this.setRepository.saveAndFlush(setEntity);
        updatePersonalStatisticsAfterAddingSet(personalStatisticEntity, setEntity, exerciseEntity);
        personalStatisticEntity.setTotalSets(personalStatisticEntity.getTotalSets() + 1);
        this.personalStatisticsRepository.saveAndFlush(personalStatisticEntity);
        return new ResponseDTO(true, List.of("Set added successfully"), null);
    }

    @Override
    public ResponseDTO deleteSetById(UUID setId, UUID userId) {
        Optional<SetEntity> optionalSetEntity = this.setRepository.findById(setId);
        if(optionalSetEntity.isEmpty()){
            return new ResponseDTO(true, null, List.of("No such set with this id: " + setId));
        }
        Optional<WorkoutEntity> optionalWorkoutEntity = this.workoutRepository.findById(optionalSetEntity.get().getWorkout().getId());
        if(!optionalWorkoutEntity.get().getCreatorUserId().equals(userId)){
            return new ResponseDTO(false, null, List.of("You do not have permission to delete a set from someone else’s workout"));
        }
        this.setRepository.deleteById(setId);
        SetEntity setEntity = optionalSetEntity.get();
        PersonalStatisticEntity personalStatisticEntity = this.personalStatisticsRepository.findByUserId(setEntity.getWorkout().getCreatorUserId()).get();
        updatePersonalStatisticsAfterDeletingSet(personalStatisticEntity, setEntity);
        personalStatisticEntity.setTotalSets(personalStatisticEntity.getTotalSets() - 1);
        if(this.setRepository.findAllByWorkoutId(setEntity.getWorkout().getId()).isEmpty()){
            personalStatisticEntity.setTotalWorkouts(personalStatisticEntity.getTotalWorkouts() - 1);
        }
        this.personalStatisticsRepository.saveAndFlush(personalStatisticEntity);
        return new ResponseDTO(true, List.of("Set deleted successfully"), null);
    }
    @Override
    public ResponseDTO updateSetById(EditSetDTO setData, UUID userId) {
        Optional<SetEntity> optionalSetEntity = this.setRepository.findById(setData.getId());
        if(optionalSetEntity.isEmpty()){
            return new ResponseDTO(true, null, List.of("No such set with this id: " + setData.getId()));
        }
        Optional<WorkoutEntity> optionalWorkoutEntity = this.workoutRepository.findById(optionalSetEntity.get().getWorkout().getId());
        if(!optionalWorkoutEntity.get().getCreatorUserId().equals(userId)){
            return new ResponseDTO(false, null, List.of("You do not have permission to update a set from someone else’s workout"));
        }
        SetEntity setEntity = optionalSetEntity.get();
        PersonalStatisticEntity personalStatisticEntity = this.personalStatisticsRepository.findByUserId(setEntity.getWorkout().getCreatorUserId()).get();
        updatePersonalStatisticsAfterDeletingSet(personalStatisticEntity, setEntity);
        ExerciseEntity exerciseEntity = this.exerciseRepository.findById(setEntity.getExercise().getId()).get();

        ResponseDTO responseDTO = checkSetProperties(exerciseEntity, setData);
        if(responseDTO != null){
            return responseDTO;
        }

        updatePersonalStatisticsAfterAddingSet(personalStatisticEntity, setMapper.toEntity(setData), exerciseEntity);

        setEntity.setVolume(setData.getVolume());
        setEntity.setDuration(setData.getDuration());
        setEntity.setDistance(setData.getDistance());
        setEntity.setReps(setData.getReps());
        this.setRepository.saveAndFlush(setEntity);
        this.personalStatisticsRepository.saveAndFlush(personalStatisticEntity);
        return new ResponseDTO(true, List.of("Set updated successfully"), null);
    }

    private void updatePersonalStatisticsAfterDeletingSet(PersonalStatisticEntity personalStatistic, SetEntity SetToRemove){
        if(SetToRemove.getReps() != null){
            if(SetToRemove.getVolume() != null){
                personalStatistic.setTotalKgLifted(personalStatistic.getTotalKgLifted() - SetToRemove.getReps() * SetToRemove.getVolume());
            }
            if(SetToRemove.getDuration() != null){
                personalStatistic.setTotalTimeTrained(personalStatistic.getTotalTimeTrained() - SetToRemove.getReps() * SetToRemove.getDuration());
            }
            if(SetToRemove.getDistance() != null){
                personalStatistic.setTotalDistance(personalStatistic.getTotalDistance() - SetToRemove.getReps() * SetToRemove.getDistance());
            }
        }else{
            if(SetToRemove.getVolume() != null){
                personalStatistic.setTotalKgLifted(personalStatistic.getTotalKgLifted() - SetToRemove.getVolume());
            }
            if(SetToRemove.getDuration() != null){
                personalStatistic.setTotalTimeTrained(personalStatistic.getTotalTimeTrained() - SetToRemove.getDuration());
            }
            if(SetToRemove.getDistance() != null){
                personalStatistic.setTotalDistance(personalStatistic.getTotalDistance() - SetToRemove.getDistance());
            }
        }
    }
    private void updatePersonalStatisticsAfterAddingSet(PersonalStatisticEntity personalStatistics, SetEntity setToAdd, ExerciseEntity exercise){
        if(exercise.getHasReps()){
            if(exercise.getHasDistance()){
                personalStatistics.setTotalDistance(personalStatistics.getTotalDistance() + setToAdd.getDistance() * setToAdd.getReps());
            }

            if(exercise.getHasDuration()){
                personalStatistics.setTotalTimeTrained(personalStatistics.getTotalTimeTrained() + setToAdd.getDuration() * setToAdd.getReps());
            }

            if(exercise.getHasVolume()){
                personalStatistics.setTotalKgLifted(personalStatistics.getTotalKgLifted() + setToAdd.getVolume() * setToAdd.getReps());
            }
        }else{
            if(exercise.getHasDistance()){
                personalStatistics.setTotalDistance(personalStatistics.getTotalDistance() + setToAdd.getDistance());
            }

            if(exercise.getHasDuration()){
                personalStatistics.setTotalTimeTrained(personalStatistics.getTotalTimeTrained() + setToAdd.getDuration());
            }

            if(exercise.getHasVolume()){
                personalStatistics.setTotalKgLifted(personalStatistics.getTotalKgLifted() + setToAdd.getVolume());
            }
        }
    }
    private ResponseDTO checkSetProperties(ExerciseEntity exerciseEntity, SetDTO setData){
        if(exerciseEntity.getHasReps() && setData.getReps() == null){
            return new ResponseDTO(false, null, List.of("Reps are required for this exercise"));
        }
        if(!exerciseEntity.getHasReps() && setData.getReps() != null){
            return new ResponseDTO(false, null, List.of("Reps are not applicable for this exercise"));
        }

        if(exerciseEntity.getHasDistance() && setData.getDistance() == null){
            return new ResponseDTO(false, null, List.of("Distance is required for this exercise"));
        }
        if(!exerciseEntity.getHasDistance() && setData.getDistance() != null){
            return new ResponseDTO(false, null, List.of("Distance is not applicable for this exercise"));
        }

        if(exerciseEntity.getHasDuration() && setData.getDuration() == null){
            return new ResponseDTO(false, null, List.of("Duration is required for this exercise"));
        }
        if(!exerciseEntity.getHasDuration() && setData.getDuration() != null){
            return new ResponseDTO(false, null, List.of("Duration is not applicable for this exercise"));
        }

        if(exerciseEntity.getHasVolume() && setData.getVolume() == null){
            return new ResponseDTO(false, null, List.of("Volume is required for this exercise"));
        }
        if(!exerciseEntity.getHasVolume() && setData.getVolume() != null){
            return new ResponseDTO(false, null, List.of("Volume is not applicable for this exercise"));
        }
        return null;
    }
    private ResponseDTO checkSetProperties(ExerciseEntity exerciseEntity, EditSetDTO setData){
        if(exerciseEntity.getHasReps() && setData.getReps() == null){
            return new ResponseDTO(false, null, List.of("Reps are required for this exercise"));
        }
        if(!exerciseEntity.getHasReps() && setData.getReps() != null){
            return new ResponseDTO(false, null, List.of("Reps are not applicable for this exercise"));
        }

        if(exerciseEntity.getHasDistance() && setData.getDistance() == null){
            return new ResponseDTO(false, null, List.of("Distance is required for this exercise"));
        }
        if(!exerciseEntity.getHasDistance() && setData.getDistance() != null){
            return new ResponseDTO(false, null, List.of("Distance is not applicable for this exercise"));
        }

        if(exerciseEntity.getHasDuration() && setData.getDuration() == null){
            return new ResponseDTO(false, null, List.of("Duration is required for this exercise"));
        }
        if(!exerciseEntity.getHasDuration() && setData.getDuration() != null){
            return new ResponseDTO(false, null, List.of("Duration is not applicable for this exercise"));
        }

        if(exerciseEntity.getHasVolume() && setData.getVolume() == null){
            return new ResponseDTO(false, null, List.of("Volume is required for this exercise"));
        }
        if(!exerciseEntity.getHasVolume() && setData.getVolume() != null){
            return new ResponseDTO(false, null, List.of("Volume is not applicable for this exercise"));
        }
        return null;
    }
}
