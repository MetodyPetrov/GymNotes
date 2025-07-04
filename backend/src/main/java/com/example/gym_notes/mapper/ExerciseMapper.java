package com.example.gym_notes.mapper;

import com.example.gym_notes.model.dto.ExerciseCreateDTO;
import com.example.gym_notes.model.entity.ExerciseEntity;
import org.mapstruct.Mapper;


@Mapper
public interface ExerciseMapper {

    ExerciseEntity toEntity(ExerciseCreateDTO dto);

    ExerciseCreateDTO toDto(ExerciseEntity entity);

}
