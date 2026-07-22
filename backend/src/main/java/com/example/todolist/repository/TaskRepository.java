package com.example.todolist.repository;

import com.example.todolist.entity.Task;
import com.example.todolist.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByTitleContainingIgnoreCaseAndStatus(String title, TaskStatus status, Pageable pageable);
    Page<Task> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
}
