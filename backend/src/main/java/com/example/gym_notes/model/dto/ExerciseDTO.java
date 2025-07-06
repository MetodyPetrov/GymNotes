package com.example.gym_notes.model.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseDTO {
    private String name;
    private String creatorUsername;
    private Boolean hasReps;
    private Boolean hasVolume;
    private Boolean hasDuration;
    private Boolean hasDistance;
    private List<String> tags;
}
