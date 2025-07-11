package com.example.gym_notes.service.impl;

import com.example.gym_notes.mapper.SetMapper;
import com.example.gym_notes.model.dto.ResponseDTO;
import com.example.gym_notes.model.dto.SetDTO;
import com.example.gym_notes.model.dto.WorkoutCreateDTO;
import com.example.gym_notes.model.dto.WorkoutExerciseDTO;
import com.example.gym_notes.model.entity.*;
import com.example.gym_notes.repository.*;
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
    private final UserLikeRepository userLikeRepository;
    private final SetMapper setMapper;

    public WorkoutServiceImpl(WorkoutRepository workoutRepository, ExerciseRepository exerciseRepository, PersonalStatisticsRepository personalStatisticsRepository, SetRepository setRepository, UserLikeRepository userLikeRepository, SetMapper setMapper) {
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
        this.personalStatisticsRepository = personalStatisticsRepository;
        this.setRepository = setRepository;
        this.userLikeRepository = userLikeRepository;
        this.setMapper = setMapper;
    }

    @Override
    public ResponseDTO createWorkout(WorkoutCreateDTO workoutCreateData, UUID userId) {
        Optional<PersonalStatisticEntity> optionalPersonalStatisticEntity = this.personalStatisticsRepository.findByUserId(userId);
        if(optionalPersonalStatisticEntity.isEmpty()){
            return new ResponseDTO(true, null, List.of("There is no user with this id: " + userId));
        }
        WorkoutEntity workoutEntity = new WorkoutEntity();
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

    @Override
    public ResponseDTO likeWorkout(UUID workoutId, UUID userId) {
        Optional<WorkoutEntity> optionalWorkoutEntity = this.workoutRepository.findById(workoutId);
        if(optionalWorkoutEntity.isEmpty()){
            return new ResponseDTO(true, null, List.of("There is no workout with this id: " + workoutId));
        }
        WorkoutEntity workout = optionalWorkoutEntity.get();
        Optional<UserLikeEntity> optionalUserLikeEntity = this.userLikeRepository.findByUserIdAndWorkoutId(userId, workoutId);
        if(optionalUserLikeEntity.isPresent()){
            if(optionalUserLikeEntity.get().isLiked()){
                return new ResponseDTO(true, null, List.of("You have already liked this workout"));
            }
            UserLikeEntity userLikeEntity = optionalUserLikeEntity.get();
            userLikeEntity.setLiked(true);
            this.userLikeRepository.saveAndFlush(userLikeEntity);
            if(workout.getLikes() == null){
                workout.setLikes(1);
            }else{
                workout.setLikes(workout.getLikes() + 1);
            }
            workout.setDislikes(workout.getDislikes() - 1);
        }else{
            UserLikeEntity userLikeEntity = new UserLikeEntity();
            userLikeEntity.setUserId(userId);
            userLikeEntity.setWorkout(workout);
            userLikeEntity.setLiked(true);
            if(workout.getLikes() == null){
                workout.setLikes(1);
            }else{
                workout.setLikes(workout.getLikes() + 1);
            }
            this.userLikeRepository.saveAndFlush(userLikeEntity);
        }
        this.workoutRepository.saveAndFlush(workout);
        return new ResponseDTO(true, List.of("Workout liked successfully"), null);
    }

    @Override
    public ResponseDTO removeLikeFromWorkout(UUID workoutId, UUID userId) {
        Optional<WorkoutEntity> optionalWorkoutEntity = this.workoutRepository.findById(workoutId);
        if(optionalWorkoutEntity.isEmpty()){
            return new ResponseDTO(true, null, List.of("There is no workout with this id: " + workoutId));
        }
        Optional<UserLikeEntity> optionalUserLikeEntity = this.userLikeRepository.findByUserIdAndWorkoutId(userId, workoutId);
        if(optionalUserLikeEntity.isEmpty() || !optionalUserLikeEntity.get().isLiked()){
            return new ResponseDTO(true, null, List.of("You haven't liked this workout"));
        }
        UserLikeEntity userLikeEntity = optionalUserLikeEntity.get();
        this.userLikeRepository.delete(userLikeEntity);
        WorkoutEntity workout = optionalWorkoutEntity.get();
        workout.setLikes(workout.getLikes() - 1);
        this.workoutRepository.saveAndFlush(workout);
        return new ResponseDTO(true, List.of("Like removed successfully"), null);
    }

    @Override
    public ResponseDTO dislikeWorkout(UUID workoutId, UUID userId) {
        Optional<WorkoutEntity> optionalWorkout = workoutRepository.findById(workoutId);
        if (optionalWorkout.isEmpty()) {
            return new ResponseDTO(true, null, List.of("There is no workout with this id: " + workoutId));
        }
        WorkoutEntity workout = optionalWorkout.get();
        Optional<UserLikeEntity> optionalReaction = this.userLikeRepository.findByUserIdAndWorkoutId(userId, workoutId);
        if (optionalReaction.isPresent()) {
            UserLikeEntity userLikeEntity = optionalReaction.get();
            if (!userLikeEntity.isLiked()) {
                return new ResponseDTO(true, null, List.of("You have already disliked this workout"));
            }
            userLikeEntity.setLiked(false);
            userLikeRepository.saveAndFlush(userLikeEntity);
            if(workout.getDislikes() == null){
                workout.setDislikes(1);
            }else{
                workout.setDislikes(workout.getDislikes() + 1);
            }
            workout.setLikes(workout.getLikes() - 1);
        } else {
            UserLikeEntity userLikeEntity = new UserLikeEntity();
            userLikeEntity.setUserId(userId);
            userLikeEntity.setWorkout(workout);
            userLikeEntity.setLiked(false);
            userLikeRepository.saveAndFlush(userLikeEntity);
            if(workout.getDislikes() == null){
                workout.setDislikes(1);
            }else{
                workout.setDislikes(workout.getDislikes() + 1);
            }
        }
        workoutRepository.saveAndFlush(workout);
        return new ResponseDTO(true, List.of("Workout disliked successfully"), null);
    }

    @Override
    public ResponseDTO removeDislikeFromWorkout(UUID workoutId, UUID userId) {
        Optional<WorkoutEntity> optionalWorkoutEntity = workoutRepository.findById(workoutId);
        if (optionalWorkoutEntity.isEmpty()) {
            return new ResponseDTO(true, null, List.of("There is no workout with this id: " + workoutId));
        }
        Optional<UserLikeEntity> optionalUserLikeEntity = userLikeRepository.findByUserIdAndWorkoutId(userId, workoutId);
        if (optionalUserLikeEntity.isEmpty() || optionalUserLikeEntity.get().isLiked()) {
            return new ResponseDTO(true, null, List.of("You haven't disliked this workout"));
        }
        UserLikeEntity userLikeEntity = optionalUserLikeEntity.get();
        userLikeRepository.delete(userLikeEntity);
        WorkoutEntity workout = optionalWorkoutEntity.get();
        workout.setDislikes(workout.getDislikes() - 1);
        workoutRepository.saveAndFlush(workout);
        return new ResponseDTO(true, List.of("Dislike removed successfully"), null);
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