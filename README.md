# ToDo List Full Stack

Aplicação Full Stack profissional para gerenciamento de tarefas, construída com Java 21, Spring Boot 3, Angular 21 LTS, Angular Material, MySQL e Docker.

## Arquitetura

O backend segue arquitetura em camadas para manter separação de responsabilidades e facilitar testes/evolução:

`Controller -> Service -> Repository`

- **Controller**: expõe endpoints REST e valida DTOs.
- **Service**: concentra regras de negócio e transações.
- **Repository**: abstrai persistência com Spring Data JPA.
- **DTO/Mapper**: isola contratos externos da entidade JPA usando MapStruct.
- **Exception Handler**: padroniza respostas de erro em JSON.

O frontend usa Angular standalone components, Reactive Forms, Services, Routing, HttpClient, Signals para estado local simples e Angular Material para UX consistente.

## Tecnologias

### Backend
- Java 21
- Spring Boot 3
- Maven
- Spring Web, Spring Data JPA, Bean Validation
- Lombok
- MapStruct
- MySQL
- Springdoc OpenAPI/Swagger
- JUnit, Mockito, H2 para integração local de testes

### Frontend
- Angular 21 LTS
- Angular Material
- Reactive Forms
- HttpClient
- Standalone Components
- Signals

### Infra
- Docker
- Docker Compose
- Nginx para servir o frontend

## Estrutura de Pastas

```text
backend/src/main/java/com/example/todolist
├── config
├── controller
├── dto
├── entity
├── enums
├── exception
├── mapper
├── repository
├── service
│   └── impl
├── validation
└── util

frontend/src/app
├── core
├── shared
└── features
    └── task
        ├── components
        ├── pages
        ├── services
        ├── models
        ├── interfaces
        └── guards
```

## Como executar localmente

### Banco MySQL

```bash
docker compose up -d mysql
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

API disponível em: `http://localhost:8080/api`.

### Frontend

```bash
cd frontend
npm install
npm start
```

Aplicação disponível em: `http://localhost:4200`.

## Como executar via Docker

```bash
docker compose up --build
```

Serviços:

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:8080/api`
- MySQL: `localhost:3306`

## Swagger

Swagger UI disponível em:

`http://localhost:8080/api/swagger-ui.html`

## Banco

Tabela principal: `tasks`

Campos:

- `id`
- `title`
- `description`
- `status`
- `created_at`
- `updated_at`

As datas são preenchidas automaticamente por JPA Auditing.

## Endpoints

| Método | Endpoint | Descrição |
| --- | --- | --- |
| GET | `/api/tasks` | Lista tarefas com paginação, busca, filtro e ordenação |
| GET | `/api/tasks/{id}` | Busca tarefa por id |
| POST | `/api/tasks` | Cria tarefa |
| PUT | `/api/tasks/{id}` | Atualiza tarefa |
| DELETE | `/api/tasks/{id}` | Remove tarefa |

### Query parameters de listagem

- `title`: busca parcial por título
- `status`: `PENDING`, `IN_PROGRESS`, `DONE`
- `page`: página
- `size`: tamanho
- `sort`: exemplo `createdAt,desc`

## Testes

```bash
cd backend
mvn test
```

Inclui testes unitários de service com Mockito e teste de integração de controller com MockMvc/H2.

## Imagens da aplicação

A interface possui tela de listagem responsiva com tabela, busca, filtro por status, paginação, confirmação de exclusão e tela de formulário com validação. Screenshots podem ser adicionados em `docs/images` após execução local.

## Decisões técnicas

- **DTOs separados da entidade** evitam acoplamento entre persistência e contrato REST.
- **MapStruct** reduz código manual de conversão e mantém type safety.
- **GlobalExceptionHandler** garante erros previsíveis para frontend e consumidores externos.
- **Profiles dev/prod** separam configuração local de configuração produtiva.
- **Paginação e filtros no backend** evitam carregar dados excessivos no frontend.
- **Standalone Components** reduzem boilerplate no Angular moderno.
- **Signals** foram usados para estado local simples de UI, preservando legibilidade.
- **Docker Compose** facilita avaliação por recrutadores com um único comando.

## Melhorias futuras

- Autenticação JWT e controle de usuários.
- Migrations com Flyway/Liquibase.
- Testcontainers habilitado em pipeline dedicado.
- Testes end-to-end com Playwright/Cypress.
- Observabilidade com Actuator, métricas e logs estruturados.
- CI com build, testes, lint e análise de cobertura.

## Sugestão de commits profissionais

- `feat: initialize spring boot task api`
- `feat: implement task CRUD with filters and pagination`
- `test: add backend unit and integration tests`
- `feat: create angular task management UI`
- `chore: add docker compose infrastructure`
- `docs: add professional project documentation`
