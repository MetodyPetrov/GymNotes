package com.example.gym_notes.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SetDTO {
    private Integer duration;
    private Integer weight;
    private Integer reps;
    private Integer distance;
    private UUID id;
}
