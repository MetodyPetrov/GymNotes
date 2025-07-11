package com.example.gym_notes.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exercises")
public class ExerciseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "creator_user_id", nullable = false)
    private UUID creatorUserId;

    @Column(name = "has_reps", nullable = false)
    private Boolean hasReps;

    @Column(name = "has_volume", nullable = false)
    private Boolean hasVolume;

    @Column(name = "has_duration", nullable = false)
    private Boolean hasDuration;

    @Column(name = "has_distance", nullable = false)
    private Boolean hasDistance;
    @ManyToMany
    @JoinTable(name = "exercise_workout_types",
            joinColumns = @JoinColumn(name = "exercise_id"),
            inverseJoinColumns = @JoinColumn(name = "workout_type_id"))
    private List<WorkoutTypeEntity> workoutTypes;

    @OneToMany(mappedBy = "exercise")
    private List<SetEntity> sets;
}