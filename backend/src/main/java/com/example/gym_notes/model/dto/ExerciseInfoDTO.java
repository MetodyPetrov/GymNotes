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
public class ExerciseInfoDTO {
    private UUID id;
    private String name;
    private List<String> workoutTags;
    private List<SetDTO> sets;

    public void addSet(SetDTO set){
        sets.add(set);
    }
}