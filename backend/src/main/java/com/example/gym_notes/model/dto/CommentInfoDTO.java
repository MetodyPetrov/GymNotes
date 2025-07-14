package com.example.gym_notes.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentInfoDTO {
    private UUID id;
    private String comment;
    private Timestamp dateCreated;
    private String owner;
    private UUID ownerId;
}
