package com.example.gym_notes.service.impl;

import com.example.gym_notes.mapper.SetMapper;
import com.example.gym_notes.model.dto.*;
import com.example.gym_notes.model.entity.*;
import com.example.gym_notes.model.enums.WorkoutType;
import com.example.gym_notes.repository.*;
import com.example.gym_notes.service.WorkoutService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;
    private final PersonalStatisticsRepository personalStatisticsRepository;
    private final SetRepository setRepository;
    private final UserLikeRepository userLikeRepository;
    private final CommentRepository commentRepository;
    private final SetMapper setMapper;

    public WorkoutServiceImpl(WorkoutRepository workoutRepository, ExerciseRepository exerciseRepository, PersonalStatisticsRepository personalStatisticsRepository, SetRepository setRepository, UserLikeRepository userLikeRepository, CommentRepository commentRepository, SetMapper setMapper) {
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
        this.personalStatisticsRepository = personalStatisticsRepository;
        this.setRepository = setRepository;
        this.userLikeRepository = userLikeRepository;
        this.commentRepository = commentRepository;
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
        Integer exerciseIndex = 0;
        for (WorkoutExerciseDTO exerciseDTO : workoutCreateData.getExercises()) {
            Optional<ExerciseEntity> optionalExerciseEntity = this.exerciseRepository.findByName(exerciseDTO.getName());
            if(optionalExerciseEntity.isEmpty()){
                return new ResponseDTO(true, null, List.of("No such exercise: " + exerciseDTO.getName()));
            }
            List<SetEntity> setEntities = getSetEntitiesByWorkoutExerciseDTO(exerciseDTO, workoutEntity, optionalExerciseEntity.get(), exerciseIndex);
            for (SetEntity setEntity : setEntities) {
                checkSetProperties(optionalExerciseEntity.get(), setEntity);
                updatePersonalStatisticsAfterAddingSet(optionalPersonalStatisticEntity.get(), setEntity, optionalExerciseEntity.get());
            }
            setEntityList.addAll(setEntities);
            exerciseIndex++;
        }
        workoutEntity.setSets(setEntityList);
        workoutEntity.setDislikes(0);
        workoutEntity.setLikes(0);
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

    @Override
    public List<WorkoutInfoDTO> getAllWorkoutsForUser(UUID userId, Pageable pageable) {
        Page<WorkoutEntity> workouts;
        workouts = this.workoutRepository.findAllByCreatorUserId(userId, pageable);
        if (workouts.isEmpty()) {
            return null;
        }
        List<WorkoutInfoDTO> toReturn = new ArrayList<>();
        for (WorkoutEntity workout : workouts) {
            WorkoutInfoDTO currentWorkoutInfo = new WorkoutInfoDTO();
            currentWorkoutInfo.setId(workout.getId());
            currentWorkoutInfo.setLikes(workout.getLikes());
            currentWorkoutInfo.setDislikes(workout.getDislikes());
            currentWorkoutInfo.setDate(workout.getDateCreated());
            Optional<UserLikeEntity> optionalUserLike = this.userLikeRepository.findByUserIdAndWorkoutId(userId, workout.getId());
            if(optionalUserLike.isEmpty()){
                currentWorkoutInfo.setHasLiked(false);
                currentWorkoutInfo.setHasDisliked(false);
            }else{
                if(optionalUserLike.get().isLiked()){
                    currentWorkoutInfo.setHasLiked(true);
                }else{
                    currentWorkoutInfo.setHasDisliked(true);
                }
            }
            List<ExerciseInfoDTO> exerciseInfos = new ArrayList<>();
            ExerciseInfoDTO currentExerciseInfo = new ExerciseInfoDTO();
            currentExerciseInfo.setSets(new ArrayList<>());
            List<SetEntity> setsList = this.setRepository.findAllByWorkoutIdOrderByExerciseIndex(workout.getId());
            Integer lastIndex = 0;
            Integer currentIndex;

            for (int i = 0; i < setsList.size(); i++) {
                SetEntity currentSetEntity = setsList.get(i);
                if(i == 0){
                    lastIndex = currentSetEntity.getExerciseIndex();
                    currentExerciseInfo.setExerciseIndex(currentSetEntity.getExerciseIndex());
                }
                currentIndex = currentSetEntity.getExerciseIndex();
                if(currentIndex.equals(lastIndex) && i != 0){
                    currentExerciseInfo.addSet(this.setMapper.toDto(currentSetEntity));
                }else{
                    if(i != 0){
                        exerciseInfos.add(currentExerciseInfo);
                    }
                    currentExerciseInfo = new ExerciseInfoDTO();
                    ExerciseEntity exercise = this.exerciseRepository.findById(currentSetEntity.getExercise().getId()).get();
                    currentExerciseInfo.setId(exercise.getId());
                    currentExerciseInfo.setName(exercise.getName());
                    currentExerciseInfo.setSets(new ArrayList<>());
                    currentExerciseInfo.addSet(this.setMapper.toDto(currentSetEntity));
                    List<String> tags = exercise.getWorkoutTypes().stream()
                            .map(WorkoutTypeEntity::getType)
                            .map(WorkoutType::name)
                            .map(String::toLowerCase)
                            .collect(Collectors.toList());
                    currentExerciseInfo.setTags(tags);
                    currentExerciseInfo.setExerciseIndex(currentSetEntity.getExerciseIndex());
                }
                lastIndex = currentSetEntity.getExerciseIndex();
            }
            currentWorkoutInfo.setExercises(exerciseInfos);
            toReturn.add(currentWorkoutInfo);
        }
        return toReturn;
    }

    @Override
    public List<WorkoutInfoDTO> getAllWorkoutsForUserByDateCreated(UUID userId, Timestamp dateCreated, Pageable pageable) {
        Page<WorkoutEntity> workouts;
        workouts = this.workoutRepository.findAllByCreatorUserIdAndDateCreated(userId, dateCreated, pageable);
        if (workouts.isEmpty()) {
            return null;
        }
        List<WorkoutInfoDTO> toReturn = new ArrayList<>();
        for (WorkoutEntity workout : workouts) {
            WorkoutInfoDTO currentWorkoutInfo = new WorkoutInfoDTO();
            currentWorkoutInfo.setId(workout.getId());
            currentWorkoutInfo.setLikes(workout.getLikes());
            currentWorkoutInfo.setDislikes(workout.getDislikes());
            currentWorkoutInfo.setDate(workout.getDateCreated());
            Optional<UserLikeEntity> optionalUserLike = this.userLikeRepository.findByUserIdAndWorkoutId(userId, workout.getId());
            if(optionalUserLike.isEmpty()){
                currentWorkoutInfo.setHasLiked(false);
                currentWorkoutInfo.setHasDisliked(false);
            }else{
                if(optionalUserLike.get().isLiked()){
                    currentWorkoutInfo.setHasLiked(true);
                }else{
                    currentWorkoutInfo.setHasDisliked(true);
                }
            }
            List<ExerciseInfoDTO> exerciseInfos = new ArrayList<>();
            ExerciseInfoDTO currentExerciseInfo = new ExerciseInfoDTO();
            currentExerciseInfo.setSets(new ArrayList<>());
            List<SetEntity> setsList = this.setRepository.findAllByWorkoutIdOrderByExerciseIndex(workout.getId());
            Integer lastIndex = 0;
            Integer currentIndex;

            for (int i = 0; i < setsList.size(); i++) {
                SetEntity currentSetEntity = setsList.get(i);
                if(i == 0){
                    lastIndex = currentSetEntity.getExerciseIndex();
                    currentExerciseInfo.setExerciseIndex(currentSetEntity.getExerciseIndex());
                }
                currentIndex = currentSetEntity.getExerciseIndex();
                if(currentIndex.equals(lastIndex)){
                    currentExerciseInfo.addSet(this.setMapper.toDto(currentSetEntity));
                }else{
                    if(i != 0){
                        exerciseInfos.add(currentExerciseInfo);
                    }
                    currentExerciseInfo = new ExerciseInfoDTO();
                    ExerciseEntity exercise = this.exerciseRepository.findById(currentSetEntity.getExercise().getId()).get();
                    currentExerciseInfo.setId(exercise.getId());
                    currentExerciseInfo.setName(exercise.getName());
                    currentExerciseInfo.setSets(new ArrayList<>());
                    currentExerciseInfo.addSet(this.setMapper.toDto(currentSetEntity));
                    List<String> tags = exercise.getWorkoutTypes().stream()
                            .map(WorkoutTypeEntity::getType)
                            .map(WorkoutType::name)
                            .map(String::toLowerCase)
                            .collect(Collectors.toList());
                    currentExerciseInfo.setTags(tags);
                    currentExerciseInfo.setExerciseIndex(currentSetEntity.getExerciseIndex());
                }
            }
            currentWorkoutInfo.setExercises(exerciseInfos);
            toReturn.add(currentWorkoutInfo);
        }
        return toReturn;
    }

    @Override
    public ResponseDTO addNewComment(UUID workoutId, UUID userId, AddCommentDTO addCommentDTO) {
        Optional<WorkoutEntity> optionalWorkout = this.workoutRepository.findById(workoutId);
        if (optionalWorkout.isEmpty()) {
            return new ResponseDTO(true, null, List.of("There is no workout with this id: " + workoutId));
        }
        CommentEntity comment = new CommentEntity();
        comment.setUserId(userId);
        comment.setMessage(addCommentDTO.getComment());
        comment.setWorkout(optionalWorkout.get());
        comment.setDateCreated(Timestamp.valueOf(LocalDateTime.now()));
        this.commentRepository.saveAndFlush(comment);
        return new ResponseDTO(true, List.of("Comment added successfully"), null);
    }

    @Override
    public ResponseDTO editComment(UUID commentId, UUID userId, EditCommentDTO editCommentData) {
        Optional<CommentEntity> optionalComment = this.commentRepository.findById(commentId);
        if (optionalComment.isEmpty()) {
            return new ResponseDTO(true, null, List.of("There is no comment with this id: " + commentId));
        }
        if(!optionalComment.get().getUserId().equals(userId)){
            return new ResponseDTO(true, null, List.of("You do not have permission to edit this comment"));
        }
        CommentEntity comment = optionalComment.get();
        comment.setMessage(editCommentData.getComment());
        this.commentRepository.saveAndFlush(comment);
        return new ResponseDTO(true, List.of("Comment edited successfully"), null);
    }

    @Override
    public List<CommentInfoDTO> getAllCommentsForWorkout(UUID workoutId) {
        Optional<WorkoutEntity> optionalWorkout = this.workoutRepository.findById(workoutId);
        if (optionalWorkout.isEmpty()) {
            return null;
        }
        List<CommentInfoDTO> commentInfoList = new ArrayList<>();
        for (CommentEntity comment : optionalWorkout.get().getComments()) {
            CommentInfoDTO currentCommentInfo = new CommentInfoDTO();
            currentCommentInfo.setId(comment.getId());
            currentCommentInfo.setComment(comment.getMessage());
            currentCommentInfo.setDateCreated(comment.getDateCreated());
            currentCommentInfo.setOwnerId(comment.getUserId());
            commentInfoList.add(currentCommentInfo);
        }
        return commentInfoList;
    }

//    @Override
//    public UUID getWorkoutCreatorById(UUID workoutId) {
//        Optional<WorkoutEntity> optionalWorkout = this.workoutRepository.findById(workoutId);
//        if (optionalWorkout.isEmpty()) {
//            return null;
//        }
//        return optionalWorkout.get().getCreatorUserId();
//    }

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

    private List<SetEntity> getSetEntitiesByWorkoutExerciseDTO(WorkoutExerciseDTO exerciseDTO, WorkoutEntity workoutEntity, ExerciseEntity exerciseEntity, Integer exerciseIndex){
        List<SetEntity> setEntityList = new ArrayList<>();
        for (AddWorkoutSetDTO setDTO : exerciseDTO.getSets()) {
            SetEntity currentSet = setMapper.toEntity(setDTO);
            currentSet.setExercise(exerciseEntity);
            currentSet.setWorkout(workoutEntity);
            currentSet.setExerciseIndex(exerciseIndex);
            setEntityList.add(currentSet);
        }
        return setEntityList;
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
    private ResponseDTO checkSetProperties(ExerciseEntity exerciseEntity, SetEntity setData){
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