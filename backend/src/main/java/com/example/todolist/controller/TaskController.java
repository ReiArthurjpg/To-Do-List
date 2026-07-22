package com.example.todolist.controller;

import com.example.todolist.dto.*;
import com.example.todolist.enums.TaskStatus;
import com.example.todolist.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Task management endpoints")
public class TaskController {
    private final TaskService service;
    @GetMapping @Operation(summary = "List tasks with pagination, title search, status filter and sorting")
    public Page<TaskResponseDTO> findAll(@RequestParam(required = false) String title, @RequestParam(required = false) TaskStatus status, @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) { return service.findAll(title, status, pageable); }
    @GetMapping("/{id}") @Operation(summary = "Find task by id")
    public TaskResponseDTO findById(@PathVariable Long id) { return service.findById(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) @Operation(summary = "Create task")
    public TaskResponseDTO create(@Valid @RequestBody TaskRequestDTO request) { return service.create(request); }
    @PutMapping("/{id}") @Operation(summary = "Update task")
    public TaskResponseDTO update(@PathVariable Long id, @Valid @RequestBody TaskRequestDTO request) { return service.update(id, request); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) @Operation(summary = "Delete task")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
