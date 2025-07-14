package com.example.gym_notes.mapper;

import com.example.gym_notes.model.dto.EditSetDTO;
import com.example.gym_notes.model.dto.SetDTO;
import com.example.gym_notes.model.entity.SetEntity;
import org.mapstruct.Mapper;

@Mapper
public interface SetMapper {
    SetEntity toEntity(SetDTO dto);
    SetDTO toDto(SetEntity entity);
    SetEntity toEntity(EditSetDTO dto);
}
