package com.example.gym_notes.repository;

import com.example.gym_notes.model.entity.WorkoutEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.UUID;

@Repository
public interface WorkoutRepository extends JpaRepository<WorkoutEntity, UUID> {
    Page<WorkoutEntity> findAllByCreatorUserId(UUID creatorUserId, Pageable pageable);
    Page<WorkoutEntity> findAllByCreatorUserIdAndDateCreatedBetween(UUID creatorUserId, Timestamp from, Timestamp to, Pageable pageable
    );
}