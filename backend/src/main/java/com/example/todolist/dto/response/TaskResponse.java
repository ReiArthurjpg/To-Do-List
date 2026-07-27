package com.example.todolist.dto.response;

import com.example.todolist.enums.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

@Schema(description = "Task representation returned by the API")
public record TaskResponse(

        @Schema(description = "Task unique identifier", example = "1")
        Long id,

        @Schema(description = "Task title", example = "Buy groceries")
        String title,

        @Schema(description = "Task description", example = "Milk, eggs, bread")
        String description,

        @Schema(description = "Task status", example = "PENDING")
        TaskStatus status,

        @Schema(description = "Creation timestamp")
        @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt,

        @Schema(description = "Last update timestamp")
        @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime updatedAt

) {}
