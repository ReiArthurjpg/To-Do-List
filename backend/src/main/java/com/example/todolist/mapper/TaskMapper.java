package com.example.todolist.mapper;

import com.example.todolist.dto.request.TaskRequest;
import com.example.todolist.dto.response.TaskResponse;
import com.example.todolist.entity.Task;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

/**
 * MapStruct mapper for converting between Task entity and DTOs.
 * Generated code is type-safe and compiled at build time (no runtime reflection).
 */
@Mapper(componentModel = "spring")
public interface TaskMapper {

    Task toEntity(TaskRequest request);

    TaskResponse toResponse(Task task);

    /**
     * Partially updates an existing Task entity from a request.
     * Null values in the request are ignored, preserving existing field values.
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(TaskRequest request, @MappingTarget Task task);
}
