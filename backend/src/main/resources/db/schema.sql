-- =============================================================
-- To-Do List  — Database Schema
-- Banco de dados: todolist
-- Gerado para visualização no phpMyAdmin / MySQL Workbench
-- OBS: o Hibernate (ddl-auto=update) cria/atualiza estas
--      tabelas automaticamente ao subir o backend.
-- =============================================================

CREATE DATABASE IF NOT EXISTS todolist
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE todolist;

-- -------------------------------------------------------------
-- Tabela: tasks
-- Mapeada pela entidade: com.example.todolist.entity.Task
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
    id          BIGINT          NOT NULL AUTO_INCREMENT,  -- PK gerada automaticamente
    title       VARCHAR(120)    NOT NULL,                 -- Título da tarefa (obrigatório)
    description VARCHAR(1000)   NULL,                     -- Descrição opcional
    status      VARCHAR(20)     NOT NULL,                 -- Enum: PENDING | IN_PROGRESS | DONE
    created_at  DATETIME(6)     NOT NULL,                 -- Preenchido pelo Spring Auditing
    updated_at  DATETIME(6)     NOT NULL,                 -- Atualizado automaticamente

    PRIMARY KEY (id),

    -- Índices para acelerar filtros por título e status
    INDEX idx_tasks_title  (title),
    INDEX idx_tasks_status (status)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- =============================================================
-- Dados de exemplo (opcional — remova se não quiser seed)
-- =============================================================
INSERT INTO tasks (title, description, status, created_at, updated_at)
VALUES
  ('Configurar ambiente Docker',  'Subir MySQL, phpMyAdmin, backend e frontend via docker-compose', 'DONE',        NOW(), NOW()),
  ('Criar CRUD de tarefas',       'Endpoints REST: GET /tasks, POST /tasks, PUT /tasks/{id}, DELETE /tasks/{id}', 'IN_PROGRESS', NOW(), NOW()),
  ('Desenvolver frontend Angular','Criar componentes de listagem, criação e edição de tarefas',                   'PENDING',     NOW(), NOW()),
  ('Escrever testes unitários',   'Cobrir serviços e controllers com JUnit 5 + Mockito',                          'PENDING',     NOW(), NOW()),
  ('Deploy em produção',          'Publicar a aplicação em um servidor cloud (ex: Railway, Render, VPS)',          'PENDING',     NOW(), NOW());

-- =============================================================
-- Consultas úteis para inspecionar o banco no phpMyAdmin
-- =============================================================

-- Ver todas as tarefas
-- SELECT * FROM tasks;

-- Filtrar por status
-- SELECT * FROM tasks WHERE status = 'PENDING';
-- SELECT * FROM tasks WHERE status = 'IN_PROGRESS';
-- SELECT * FROM tasks WHERE status = 'DONE';

-- Contagem por status
-- SELECT status, COUNT(*) AS total FROM tasks GROUP BY status;

-- Ver estrutura da tabela
-- DESCRIBE tasks;
-- SHOW CREATE TABLE tasks;

-- Ver índices
-- SHOW INDEX FROM tasks;
