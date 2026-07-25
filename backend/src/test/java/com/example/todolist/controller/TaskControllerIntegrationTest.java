package com.example.todolist.controller;

import com.example.todolist.dto.request.TaskRequest;
import com.example.todolist.enums.TaskStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect"
})
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
@DisplayName("TaskController Integration Tests")
class TaskControllerIntegrationTest {

    private static final String BASE_URL = "/v1/tasks";

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper objectMapper;

    // -------------------------------------------------------------------------
    // POST /v1/tasks
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("POST /v1/tasks")
    class CreateTask {

        @Test
        @DisplayName("should return 201 Created with Location header when task is valid")
        void shouldReturn201WhenTaskIsValid() throws Exception {
            TaskRequest request = new TaskRequest("Buy groceries", "Milk and eggs", TaskStatus.PENDING);

            mvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(header().exists("Location"))
                    .andExpect(jsonPath("$.id", notNullValue()))
                    .andExpect(jsonPath("$.title", is("Buy groceries")))
                    .andExpect(jsonPath("$.status", is("PENDING")));
        }

        @Test
        @DisplayName("should return 400 Bad Request when title is blank")
        void shouldReturn400WhenTitleIsBlank() throws Exception {
            TaskRequest request = new TaskRequest("", null, TaskStatus.PENDING);

            mvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fields.title", notNullValue()));
        }

        @Test
        @DisplayName("should return 400 Bad Request when status is null")
        void shouldReturn400WhenStatusIsNull() throws Exception {
            TaskRequest request = new TaskRequest("Valid title", null, null);

            mvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.fields.status", notNullValue()));
        }

        @Test
        @DisplayName("should return 400 Bad Request when body is malformed JSON")
        void shouldReturn400WhenBodyIsMalformedJson() throws Exception {
            mvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{ invalid json }"))
                    .andExpect(status().isBadRequest());
        }
    }

    // -------------------------------------------------------------------------
    // GET /v1/tasks
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("GET /v1/tasks")
    class ListTasks {

        @Test
        @DisplayName("should return 200 with paginated list")
        void shouldReturn200WithPaginatedList() throws Exception {
            mvc.perform(get(BASE_URL))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content").isArray());
        }

        @Test
        @DisplayName("should return filtered results when title query param is provided")
        void shouldFilterByTitle() throws Exception {
            TaskRequest request = new TaskRequest("Filtered task", null, TaskStatus.PENDING);
            mvc.perform(post(BASE_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)));

            mvc.perform(get(BASE_URL).param("title", "Filtered"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.content[0].title", is("Filtered task")));
        }
    }

    // -------------------------------------------------------------------------
    // GET /v1/tasks/{id}
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("GET /v1/tasks/{id}")
    class FindById {

        @Test
        @DisplayName("should return 404 Not Found when task does not exist")
        void shouldReturn404WhenTaskDoesNotExist() throws Exception {
            mvc.perform(get(BASE_URL + "/999"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.message", notNullValue()));
        }
    }

    // -------------------------------------------------------------------------
    // PUT /v1/tasks/{id}
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("PUT /v1/tasks/{id}")
    class UpdateTask {

        @Test
        @DisplayName("should return 200 with updated task when task exists")
        void shouldReturn200WithUpdatedTask() throws Exception {
            // create first
            TaskRequest create = new TaskRequest("Original title", null, TaskStatus.PENDING);
            String createResponse = mvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(create)))
                    .andReturn().getResponse().getContentAsString();

            Long id = objectMapper.readTree(createResponse).get("id").asLong();

            // then update
            TaskRequest update = new TaskRequest("Updated title", "New desc", TaskStatus.DONE);
            mvc.perform(put(BASE_URL + "/" + id)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(update)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.title", is("Updated title")))
                    .andExpect(jsonPath("$.status", is("DONE")));
        }

        @Test
        @DisplayName("should return 404 Not Found when task does not exist")
        void shouldReturn404WhenTaskDoesNotExist() throws Exception {
            TaskRequest request = new TaskRequest("Title", null, TaskStatus.PENDING);

            mvc.perform(put(BASE_URL + "/999")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isNotFound());
        }
    }

    // -------------------------------------------------------------------------
    // DELETE /v1/tasks/{id}
    // -------------------------------------------------------------------------

    @Nested
    @DisplayName("DELETE /v1/tasks/{id}")
    class DeleteTask {

        @Test
        @DisplayName("should return 204 No Content when task is deleted successfully")
        void shouldReturn204WhenDeletedSuccessfully() throws Exception {
            TaskRequest create = new TaskRequest("Task to delete", null, TaskStatus.PENDING);
            String createResponse = mvc.perform(post(BASE_URL)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(create)))
                    .andReturn().getResponse().getContentAsString();

            Long id = objectMapper.readTree(createResponse).get("id").asLong();

            mvc.perform(delete(BASE_URL + "/" + id))
                    .andExpect(status().isNoContent());
        }

        @Test
        @DisplayName("should return 404 Not Found when task does not exist")
        void shouldReturn404WhenTaskDoesNotExist() throws Exception {
            mvc.perform(delete(BASE_URL + "/999"))
                    .andExpect(status().isNotFound());
        }
    }
}
