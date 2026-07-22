package com.example.todolist.service;

import com.example.todolist.dto.*;
import com.example.todolist.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {
    Page<TaskResponseDTO> findAll(String title, TaskStatus status, Pageable pageable);
    TaskResponseDTO findById(Long id);
    TaskResponseDTO create(TaskRequestDTO request);
    TaskResponseDTO update(Long id, TaskRequestDTO request);
    void delete(Long id);
}
