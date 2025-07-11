package com.example.gym_notes.repository;

import com.example.gym_notes.model.entity.UserLikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserLikeRepository extends JpaRepository<UserLikeEntity, Integer> {
    Optional<UserLikeEntity> findByUserIdAndWorkoutId(UUID userId, UUID workoutId);
}
