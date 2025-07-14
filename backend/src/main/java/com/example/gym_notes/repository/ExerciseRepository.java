package com.example.gym_notes.repository;

import com.example.gym_notes.model.entity.ExerciseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<ExerciseEntity, UUID> {
    Optional<ExerciseEntity> findByName(String name);
}