package com.example.gym_notes.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "personal_statistics")
public class PersonalStatistic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "total_kg_lifted")
    private Integer totalKgLifted;

    @Column(name = "total_workouts")
    private Integer totalWorkouts;

    @Column(name = "total_time_trained")
    private Integer totalTimeTrained;

    @Column(name = "total_sets")
    private Integer totalSets;
}
