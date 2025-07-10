package com.example.gym_notes.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseCreateDTO {
    private String name;
    private Boolean hasVolume;
    private Boolean hasDuration;
    private Boolean hasDistance;
    private Boolean hasReps;
    private List<String> workoutTags;
}