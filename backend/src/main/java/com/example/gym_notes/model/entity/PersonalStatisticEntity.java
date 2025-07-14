package com.example.gym_notes.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "personal_statistics")
public class PersonalStatisticEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id",nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String username;

    @Column(name = "total_kg_lifted")
    private Integer totalKgLifted;

    @Column(name = "total_workouts")
    private Integer totalWorkouts;

    @Column(name = "total_time_trained")
    private Integer totalTimeTrained;

    @Column(name = "total_sets")
    private Integer totalSets;

    @Column(name = "total_distance")
    private Integer totalDistance;
}
