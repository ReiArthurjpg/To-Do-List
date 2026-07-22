package com.example.todolist.dto;

import com.example.todolist.enums.TaskStatus;
import java.time.LocalDateTime;

public record TaskResponseDTO(Long id, String title, String description, TaskStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {}
