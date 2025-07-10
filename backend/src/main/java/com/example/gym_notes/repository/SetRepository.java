package com.example.gym_notes.repository;

import com.example.gym_notes.model.entity.SetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SetRepository extends JpaRepository<SetEntity, UUID> {
    void deleteAllByWorkoutIdAndExerciseId(UUID workoutId, UUID exerciseId);
    List<SetEntity> findAllByWorkoutId(UUID workoutId);
}
