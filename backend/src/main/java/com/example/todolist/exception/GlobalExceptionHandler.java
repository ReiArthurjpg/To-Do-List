package com.example.todolist.exception;

import com.example.todolist.dto.ErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) { return build(HttpStatus.NOT_FOUND, ex.getMessage(), request, null); }
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponseDTO> handleBusiness(BusinessException ex, HttpServletRequest request) { return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request, null); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String,String> fields = ex.getBindingResult().getFieldErrors().stream().collect(Collectors.toMap(e -> e.getField(), e -> e.getDefaultMessage() == null ? "Invalid value" : e.getDefaultMessage(), (a,b) -> a));
        return build(HttpStatus.BAD_REQUEST, "Validation failed", request, fields);
    }
    @ExceptionHandler({MethodArgumentTypeMismatchException.class, IllegalArgumentException.class})
    public ResponseEntity<ErrorResponseDTO> handleBadRequest(Exception ex, HttpServletRequest request) { return build(HttpStatus.BAD_REQUEST, "Invalid request parameter", request, null); }
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNoResourceFound(NoResourceFoundException ex, HttpServletRequest request) { return build(HttpStatus.NOT_FOUND, "Resource not found: " + request.getRequestURI(), request, null); }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleUnexpected(Exception ex, HttpServletRequest request) { return build(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error", request, null); }
    private ResponseEntity<ErrorResponseDTO> build(HttpStatus status, String message, HttpServletRequest request, Map<String,String> fields) {
        return ResponseEntity.status(status).body(new ErrorResponseDTO(LocalDateTime.now(), status.value(), status.getReasonPhrase(), message, request.getRequestURI(), fields));
    }
}
