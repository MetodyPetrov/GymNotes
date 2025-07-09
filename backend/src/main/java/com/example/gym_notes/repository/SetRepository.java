package com.example.gym_notes.repository;

import com.example.gym_notes.model.entity.SetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SetRepository extends JpaRepository<SetEntity, Integer> {
    void deleteAllByWorkoutIdAndExerciseId(Integer workoutId, Integer exerciseId);
    List<SetEntity> findAllByWorkoutId(Integer workoutId);
}
