package com.example.gym_notes.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddWorkoutSetDTO {
    private Integer duration;
    private Integer volume;
    private Integer reps;
    private Integer distance;
}