package com.example.gym_notes.repository;

import com.example.gym_notes.model.entity.WorkoutTypeEntity;
import com.example.gym_notes.model.enums.WorkoutType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkoutTypeRepository extends JpaRepository<WorkoutTypeEntity, Integer> {
    Optional<WorkoutTypeEntity> findByType(WorkoutType type);
}
