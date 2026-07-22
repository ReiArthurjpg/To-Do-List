package com.example.todolist.mapper;

import com.example.todolist.dto.TaskRequestDTO;
import com.example.todolist.dto.TaskResponseDTO;
import com.example.todolist.entity.Task;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    Task toEntity(TaskRequestDTO dto);
    TaskResponseDTO toResponse(Task task);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(TaskRequestDTO dto, @MappingTarget Task task);
}
