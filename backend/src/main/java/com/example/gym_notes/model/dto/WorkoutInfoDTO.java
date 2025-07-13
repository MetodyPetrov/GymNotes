package com.example.gym_notes.model.dto;

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
public class WorkoutInfoDTO {
    private UUID id;
    private Integer likes;
    private Integer dislikes;
    private boolean hasLiked;
    private boolean hasDisliked;
    private List<ExerciseInfoDTO> exercises;
}
