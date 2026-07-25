package com.example.todolist.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.Map;

@Schema(description = "Standard error response body")
public record ErrorResponse(

        @Schema(description = "Error timestamp")
        LocalDateTime timestamp,

        @Schema(description = "HTTP status code", example = "404")
        int status,

        @Schema(description = "HTTP status reason phrase", example = "Not Found")
        String error,

        @Schema(description = "Human-readable error message", example = "Task not found with id: 1")
        String message,

        @Schema(description = "Request path that triggered the error", example = "/api/v1/tasks/1")
        String path,

        @Schema(description = "Field-level validation errors (only present on 400 validation errors)")
        Map<String, String> fields

) {}
