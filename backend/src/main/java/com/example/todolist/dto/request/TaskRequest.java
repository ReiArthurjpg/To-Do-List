package com.example.todolist.dto.request;

import com.example.todolist.enums.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "Payload for creating or updating a task")
public record TaskRequest(

        @Schema(description = "Task title", example = "Buy groceries", minLength = 3, maxLength = 120)
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 120, message = "Title must be between 3 and 120 characters")
        String title,

        @Schema(description = "Task description", example = "Milk, eggs, bread", maxLength = 1000)
        @Size(max = 1000, message = "Description must have at most 1000 characters")
        String description,

        @Schema(description = "Task status", example = "PENDING")
        @NotNull(message = "Status is required")
        TaskStatus status

) {}
