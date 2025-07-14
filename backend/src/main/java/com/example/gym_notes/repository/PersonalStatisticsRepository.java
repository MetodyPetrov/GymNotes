package com.example.gym_notes.repository;

import com.example.gym_notes.model.entity.PersonalStatisticEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonalStatisticsRepository extends JpaRepository<PersonalStatisticEntity, Integer> {
    Optional<PersonalStatisticEntity> findByUserId(UUID userId);
    Page<PersonalStatisticEntity> findByUsernameStartingWith(String username, Pageable pageable);
}
