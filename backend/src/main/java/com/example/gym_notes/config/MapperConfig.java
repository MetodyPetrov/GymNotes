package com.example.gym_notes.config;

import com.example.gym_notes.mapper.ExerciseMapper;
import com.example.gym_notes.mapper.SetMapper;
import org.mapstruct.factory.Mappers;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {
    @Bean
    public ExerciseMapper exerciseMapper() {
        return Mappers.getMapper(ExerciseMapper.class);
    }
    @Bean
    public SetMapper setMapper(){return Mappers.getMapper(SetMapper.class);}
}