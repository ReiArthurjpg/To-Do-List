package com.example.todolist.service;

import com.example.todolist.dto.request.TaskRequest;
import com.example.todolist.dto.response.TaskResponse;
import com.example.todolist.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TaskService {

    Page<TaskResponse> findAll(String title, TaskStatus status, Pageable pageable);

    TaskResponse findById(Long id);

    TaskResponse create(TaskRequest request);

    TaskResponse update(Long id, TaskRequest request);

    void delete(Long id);
}
