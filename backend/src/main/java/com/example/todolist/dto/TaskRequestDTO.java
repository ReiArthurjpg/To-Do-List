package com.example.todolist.dto;

import com.example.todolist.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TaskRequestDTO(
        @NotBlank(message = "Title is required") @Size(max = 120, message = "Title must have at most 120 characters") String title,
        @Size(max = 1000, message = "Description must have at most 1000 characters") String description,
        @NotNull(message = "Status is required") TaskStatus status
) {}
