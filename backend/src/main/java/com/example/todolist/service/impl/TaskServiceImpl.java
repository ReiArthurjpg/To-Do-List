package com.example.todolist.service.impl;

import com.example.todolist.dto.request.TaskRequest;
import com.example.todolist.dto.response.TaskResponse;
import com.example.todolist.entity.Task;
import com.example.todolist.enums.TaskStatus;
import com.example.todolist.exception.ResourceNotFoundException;
import com.example.todolist.mapper.TaskMapper;
import com.example.todolist.repository.TaskRepository;
import com.example.todolist.service.TaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Slf4j
@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository repository;
    private final TaskMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> findAll(String title, TaskStatus status, Pageable pageable) {
        log.debug("Fetching tasks — title filter: '{}', status filter: '{}'", title, status);

        boolean hasTitle = StringUtils.hasText(title);
        boolean hasStatus = status != null;

        Page<Task> page;

        if (hasTitle && hasStatus) {
            page = repository.findByTitleContainingIgnoreCaseAndStatus(title.trim(), status, pageable);
        } else if (hasTitle) {
            page = repository.findByTitleContainingIgnoreCase(title.trim(), pageable);
        } else if (hasStatus) {
            page = repository.findByStatus(status, pageable);
        } else {
            page = repository.findAll(pageable);
        }

        return page.map(mapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse findById(Long id) {
        log.debug("Fetching task with id: {}", id);
        return mapper.toResponse(findEntityById(id));
    }

    @Override
    @Transactional
    public TaskResponse create(TaskRequest request) {
        log.info("Creating task with title: '{}'", request.title());
        Task saved = repository.save(mapper.toEntity(request));
        log.info("Task created successfully with id: {}", saved.getId());
        return mapper.toResponse(saved);
    }

    @Override
    @Transactional
    public TaskResponse update(Long id, TaskRequest request) {
        log.info("Updating task with id: {}", id);
        Task task = findEntityById(id);
        mapper.updateEntity(request, task);
        Task saved = repository.save(task);
        log.info("Task with id: {} updated successfully", id);
        return mapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        log.info("Deleting task with id: {}", id);
        repository.delete(findEntityById(id));
        log.info("Task with id: {} deleted successfully", id);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private Task findEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }
}
