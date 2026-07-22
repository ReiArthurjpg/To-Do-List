package com.example.todolist.service.impl;

import com.example.todolist.dto.*;
import com.example.todolist.entity.Task;
import com.example.todolist.enums.TaskStatus;
import com.example.todolist.exception.ResourceNotFoundException;
import com.example.todolist.mapper.TaskMapper;
import com.example.todolist.repository.TaskRepository;
import com.example.todolist.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository repository;
    private final TaskMapper mapper;
    @Override @Transactional(readOnly = true)
    public Page<TaskResponseDTO> findAll(String title, TaskStatus status, Pageable pageable) {
        boolean hasTitle = StringUtils.hasText(title);
        Page<Task> page = hasTitle && status != null ? repository.findByTitleContainingIgnoreCaseAndStatus(title.trim(), status, pageable) : hasTitle ? repository.findByTitleContainingIgnoreCase(title.trim(), pageable) : status != null ? repository.findByStatus(status, pageable) : repository.findAll(pageable);
        return page.map(mapper::toResponse);
    }
    @Override @Transactional(readOnly = true)
    public TaskResponseDTO findById(Long id) { return mapper.toResponse(findEntity(id)); }
    @Override @Transactional
    public TaskResponseDTO create(TaskRequestDTO request) { return mapper.toResponse(repository.save(mapper.toEntity(request))); }
    @Override @Transactional
    public TaskResponseDTO update(Long id, TaskRequestDTO request) { Task task = findEntity(id); mapper.updateEntity(request, task); return mapper.toResponse(repository.save(task)); }
    @Override @Transactional
    public void delete(Long id) { repository.delete(findEntity(id)); }
    private Task findEntity(Long id) { return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id)); }
}
