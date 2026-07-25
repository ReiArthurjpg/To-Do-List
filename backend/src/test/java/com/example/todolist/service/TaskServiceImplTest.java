package com.example.todolist.service;

import com.example.todolist.dto.request.TaskRequest;
import com.example.todolist.dto.response.TaskResponse;
import com.example.todolist.entity.Task;
import com.example.todolist.enums.TaskStatus;
import com.example.todolist.exception.ResourceNotFoundException;
import com.example.todolist.mapper.TaskMapper;
import com.example.todolist.repository.TaskRepository;
import com.example.todolist.service.impl.TaskServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("TaskServiceImpl")
class TaskServiceImplTest {

    @Mock
    private TaskRepository repository;

    @Mock
    private TaskMapper mapper;

    @InjectMocks
    private TaskServiceImpl service;

    // -------------------------------------------------------------------------
    // create
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("create()")
    class Create {

        @Test
        @DisplayName("should create and return task when request is valid")
        void shouldCreateAndReturnTask() {
            TaskRequest request = new TaskRequest("Buy groceries", "Milk and eggs", TaskStatus.PENDING);
            Task entity = Task.builder().title("Buy groceries").status(TaskStatus.PENDING).build();
            Task saved = Task.builder().id(1L).title("Buy groceries").status(TaskStatus.PENDING).build();
            TaskResponse expected = new TaskResponse(1L, "Buy groceries", "Milk and eggs", TaskStatus.PENDING, null, null);

            when(mapper.toEntity(request)).thenReturn(entity);
            when(repository.save(entity)).thenReturn(saved);
            when(mapper.toResponse(saved)).thenReturn(expected);

            TaskResponse result = service.create(request);

            assertThat(result.id()).isEqualTo(1L);
            assertThat(result.title()).isEqualTo("Buy groceries");
            assertThat(result.status()).isEqualTo(TaskStatus.PENDING);
        }
    }

    // -------------------------------------------------------------------------
    // findById
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("findById()")
    class FindById {

        @Test
        @DisplayName("should return task when ID exists")
        void shouldReturnTaskWhenIdExists() {
            Task task = Task.builder().id(1L).title("Task").status(TaskStatus.PENDING).build();
            TaskResponse expected = new TaskResponse(1L, "Task", null, TaskStatus.PENDING, null, null);

            when(repository.findById(1L)).thenReturn(Optional.of(task));
            when(mapper.toResponse(task)).thenReturn(expected);

            TaskResponse result = service.findById(1L);

            assertThat(result.id()).isEqualTo(1L);
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when ID does not exist")
        void shouldThrowWhenIdNotFound() {
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.findById(99L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Task not found with id: 99");
        }
    }

    // -------------------------------------------------------------------------
    // delete
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("delete()")
    class Delete {

        @Test
        @DisplayName("should delete task when ID exists")
        void shouldDeleteTaskWhenIdExists() {
            Task task = Task.builder().id(1L).title("Task").status(TaskStatus.PENDING).build();
            when(repository.findById(1L)).thenReturn(Optional.of(task));

            service.delete(1L);

            verify(repository).delete(task);
        }

        @Test
        @DisplayName("should throw ResourceNotFoundException when ID does not exist")
        void shouldThrowWhenDeletingNonExistentTask() {
            when(repository.findById(42L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.delete(42L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Task not found with id: 42");
        }
    }

    // -------------------------------------------------------------------------
    // update
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("update()")
    class Update {

        @Test
        @DisplayName("should throw ResourceNotFoundException when ID does not exist")
        void shouldThrowWhenUpdatingNonExistentTask() {
            TaskRequest request = new TaskRequest("New title", null, TaskStatus.DONE);
            when(repository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> service.update(99L, request))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Task not found with id: 99");
        }
    }
}
