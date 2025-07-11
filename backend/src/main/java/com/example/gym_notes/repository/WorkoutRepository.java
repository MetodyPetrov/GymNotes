package com.example.gym_notes.repository;

import com.example.gym_notes.model.entity.WorkoutEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WorkoutRepository extends JpaRepository<WorkoutEntity, UUID> {

}