package com.example.todolist.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.boot.SpringBootVersion;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/health")
@Tag(name = "Health", description = "Application health check")
public class HealthController {

    @GetMapping
    @Operation(
            summary = "Health check",
            description = "Returns current application status, version, and server timestamp."
    )
    public ResponseEntity<HealthResponse> health() {
        return ResponseEntity.ok(new HealthResponse(
                "UP",
                "todo-list-api",
                "v1",
                "Spring Boot " + SpringBootVersion.getVersion(),
                LocalDateTime.now()
        ));
    }

    public record HealthResponse(
            String status,
            String application,
            String apiVersion,
            String framework,
            LocalDateTime timestamp
    ) {}
}
