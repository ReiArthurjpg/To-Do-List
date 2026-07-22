package com.example.todolist.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/health")
@Tag(name = "Health", description = "Application health check")
public class HealthController {

    @GetMapping
    @Operation(summary = "Health check - returns application status and timestamp")
    public Map<String, Object> health() {
        return Map.of(
            "status", "UP",
            "application", "todo-list-api",
            "timestamp", LocalDateTime.now()
        );
    }
}
