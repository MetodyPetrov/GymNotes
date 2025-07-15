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
public class UserInfoDTO {
    private UUID id;
    private String name;
    private Integer volume;
    private Integer workouts;
    private Integer duration;
    private Integer sets;
    private Integer distance;
}