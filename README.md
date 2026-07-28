<p align="center">
  <img src="https://img.shields.io/badge/To--Do%20List-Fullstack-6C63FF?style=for-the-badge&logo=checkmarx&logoColor=white" alt="To-Do List Fullstack">
</p>

<p align="center">
  <a href="https://www.java.com/"><img src="https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 21"></a>
  <a href="https://spring.io/projects/spring-boot"><img src="https://img.shields.io/badge/Spring%20Boot-3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot 3"></a>
  <a href="https://angular.io/"><img src="https://img.shields.io/badge/Angular-21%20LTS-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 21"></a>
  <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-8.0%2B-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"></a>
  <a href="https://swagger.io/"><img src="https://img.shields.io/badge/OpenAPI-3.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger"></a>
  <img src="https://img.shields.io/badge/status-ativo-00B4D8?style=for-the-badge" alt="Status">
</p>

---

## 📋 Objetivo da Aplicação

**To-Do List Fullstack** é uma aplicação web completa para gerenciamento de tarefas do dia a dia, desenvolvida como teste prático para avaliação de desenvolvedor Fullstack. A aplicação permite criar, listar, editar e remover tarefas, com interface Angular moderna e API REST em Java + Spring Boot.

> Projeto construído seguindo boas práticas de arquitetura em camadas, uso de DTOs, mapeamento com MapStruct, validações via Bean Validation, documentação via Swagger/OpenAPI e containerização com Docker.

---

## 🎯 Funcionalidades

| Recurso | Status |
|---|---|
| Listar todas as tarefas | ✅ |
| Buscar tarefa por ID | ✅ |
| Criar tarefa | ✅ |
| Editar tarefa | ✅ |
| Excluir tarefa | ✅ |
| Filtro por status | ✅ |
| Busca por título | ✅ |
| Paginação e ordenação | ✅ |
| Mensagens de sucesso e erro | ✅ |
| Validação com Bean Validation | ✅ |
| Documentação Swagger UI | ✅ |
| Tratamento global de exceções | ✅ |
| Testes unitários (Mockito) | ✅ |
| Testes de integração (MockMvc/H2) | ✅ |
| Containerização Docker | ✅ |

---

## 🛠️ Tecnologias

### Backend

| Categoria | Tecnologia | Versão |
|---|---|---|
| Linguagem | Java | 21 |
| Framework | Spring Boot | 3 |
| Build | Maven | — |
| Persistência | Spring Data JPA | — |
| Banco de Dados | MySQL | 8.0+ |
| Validação | Bean Validation (Jakarta) | — |
| Mapeamento | MapStruct | — |
| Boilerplate | Lombok | — |
| Documentação | Springdoc OpenAPI / Swagger | — |
| Testes | JUnit 5, Mockito, H2 (integração) | — |

### Frontend

| Categoria | Tecnologia | Versão |
|---|---|---|
| Framework | Angular | 21 LTS |
| UI Components | Angular Material | — |
| Formulários | Reactive Forms | — |
| HTTP | HttpClient | — |
| Arquitetura | Standalone Components + Signals | — |

### Infraestrutura

| Categoria | Tecnologia |
|---|---|
| Container | Docker |
| Orquestração | Docker Compose |
| Servidor Web | Nginx (frontend) |

---

## 🏛️ Arquitetura

O backend segue arquitetura em camadas com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────────────────┐
│                      Cliente (Angular)                   │
└─────────────────────┬───────────────────────────────────┘
                       │
┌─────────────────────▼───────────────────────────────────┐
│              Controller (REST API)                       │
│         Validação de DTOs · Mapeamento de rotas         │
└──────┬──────────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────────┐
│                    Service                               │
│         Regras de negócio · Transações                  │
└──────┬──────────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────────┐
│                  Repository                              │
│         Spring Data JPA · Filtros · Paginação           │
└──────┬──────────────────────────────────────────────────┘
       │
┌──────▼──────────────┐
│   MySQL (JPA)       │  ← tasks
└─────────────────────┘
```

O frontend utiliza Angular standalone components com serviços injetáveis, Reactive Forms para formulários e Angular Material para UX consistente.

---

## 📁 Estrutura de Pastas

```
To-Do-List/
│
├── backend/
│   ├── src/
│   │   └── main/java/com/example/todolist/
│   │       ├── config/               # Configurações (CORS, JPA Auditing, Perfis)
│   │       ├── controller/           # Endpoints REST
│   │       ├── dto/                  # Request e Response DTOs
│   │       ├── entity/               # Entidades JPA
│   │       ├── enums/                # Enum TaskStatus (PENDING, IN_PROGRESS, DONE)
│   │       ├── exception/            # GlobalExceptionHandler
│   │       ├── mapper/               # MapStruct — TaskMapper
│   │       ├── repository/           # Spring Data JPA Repositories
│   │       ├── service/              # Interfaces de serviço
│   │       │   └── impl/             # Implementações
│   │       ├── validation/           # Validadores customizados
│   │       └── util/                 # Utilitários
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/app/
│   │   ├── core/                     # Guards, interceptors, serviços globais
│   │   ├── shared/                   # Componentes e pipes reutilizáveis
│   │   └── features/task/
│   │       ├── components/           # Componentes de UI (tabela, formulário, dialog)
│   │       ├── pages/                # Páginas (lista, formulário)
│   │       ├── services/             # TaskService (HttpClient)
│   │       ├── models/               # Interfaces e tipos
│   │       ├── interfaces/           # Contratos de dados
│   │       └── guards/               # Route guards
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Como Executar via Docker

> **Recomendado** — sobe toda a stack (backend + frontend + banco) com um único comando.

### Pré-requisitos

- Docker Desktop instalado e em execução

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/ReiArthurjpg/To-Do-List.git
cd To-Do-List
```

**2. Suba toda a stack**
```bash
docker compose up --build
```

**3. Acesse a aplicação**

| Serviço | URL |
|---|---|
| Frontend (Angular) | http://localhost:4200 |
| Backend (API REST) | http://localhost:8080/api |
| Swagger UI | http://localhost:8080/api/swagger-ui.html |
| MySQL | localhost:3306 |

> O banco de dados é criado automaticamente pelo JPA Auditing na primeira inicialização.

---

## 🔧 Como Executar Manualmente

### Pré-requisitos

- Java 21+
- Maven 3.9+
- Node.js 20+
- MySQL 8.0+

---

### 1. Banco de Dados

Suba apenas o MySQL via Docker:
```bash
docker compose up -d mysql
```

Ou configure manualmente um banco MySQL local com as credenciais em `backend/src/main/resources/application-dev.properties`.

---

### 2. Backend

```bash
cd backend
mvn spring-boot:run
```

API disponível em: `http://localhost:8080/api`

> O perfil padrão é `dev`. Para produção, use `-Dspring.profiles.active=prod`.

---

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Aplicação disponível em: `http://localhost:4200`

---

## 🌐 Como Acessar a Aplicação

Após inicializar (via Docker ou manualmente):

- **Tela de listagem**: `http://localhost:4200`
  - Exibe todas as tarefas com título, status e data de criação
  - Permite buscar por título, filtrar por status e ordenar por data
  - Ações de editar e excluir por tarefa

- **Tela de cadastro/edição**: acessível pelos botões na listagem
  - Preencha título (obrigatório), descrição e status
  - Validação em tempo real com mensagens de erro

---

## 🗺️ Como Acessar a API

A API REST está disponível em `http://localhost:8080/api`.

### Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/api/tasks` | Lista tarefas (suporta paginação, busca e filtro) |
| `GET` | `/api/tasks/{id}` | Busca tarefa por ID |
| `POST` | `/api/tasks` | Cria nova tarefa |
| `PUT` | `/api/tasks/{id}` | Atualiza tarefa existente |
| `DELETE` | `/api/tasks/{id}` | Remove tarefa |

### Query Parameters de Listagem

| Parâmetro | Tipo | Descrição | Exemplo |
|---|---|---|---|
| `title` | string | Busca parcial por título | `?title=estudo` |
| `status` | string | Filtra por status | `?status=PENDING` |
| `page` | int | Número da página (0-indexed) | `?page=0` |
| `size` | int | Itens por página | `?size=10` |
| `sort` | string | Campo e direção de ordenação | `?sort=createdAt,desc` |

### Exemplos de Requisição

**Listar tarefas:**
```bash
curl http://localhost:8080/api/tasks
```

**Buscar com filtros:**
```bash
curl "http://localhost:8080/api/tasks?status=PENDING&title=estudo&sort=createdAt,desc"
```

**Criar tarefa:**
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudar Spring Boot",
    "description": "Finalizar curso",
    "status": "PENDING"
  }'
```

**Atualizar tarefa:**
```bash
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudar Spring Boot",
    "description": "Finalizar curso e fazer exercícios",
    "status": "IN_PROGRESS"
  }'
```

**Excluir tarefa:**
```bash
curl -X DELETE http://localhost:8080/api/tasks/1
```

---

## 📖 Swagger UI

A documentação interativa da API está disponível em:

```
http://localhost:8080/api/swagger-ui.html
```

O JSON OpenAPI 3.0 pode ser obtido em:
```
http://localhost:8080/api/v3/api-docs
```

---

## 🧪 Como Executar Testes

```bash
cd backend
mvn test
```

### Cobertura de Testes

| Tipo | Ferramenta | O que testa |
|---|---|---|
| Unitários | JUnit 5 + Mockito | Regras de negócio no `TaskServiceImpl` |
| Integração | MockMvc + H2 in-memory | Endpoints REST completos (CRUD + validações) |

> Os testes de integração usam um banco H2 em memória, sem necessidade de MySQL rodando.

---

## 🗄️ Banco de Dados

O sistema utiliza **1 tabela** no MySQL:

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `BIGINT` (PK, auto-increment) | Identificador único |
| `title` | `VARCHAR(255)` NOT NULL | Título da tarefa (obrigatório) |
| `description` | `TEXT` | Descrição detalhada |
| `status` | `ENUM` | `PENDING`, `IN_PROGRESS`, `DONE` |
| `created_at` | `DATETIME` | Preenchido automaticamente pelo JPA Auditing |
| `updated_at` | `DATETIME` | Atualizado automaticamente pelo JPA Auditing |

> As datas são gerenciadas pelo **JPA Auditing** com `@CreatedDate` e `@LastModifiedDate`, sem intervenção manual.

---

## 🔒 Regras de Negócio

- O **título** da tarefa é obrigatório (validado via `@NotBlank`)
- O **status** aceita apenas: `PENDING`, `IN_PROGRESS`, `DONE`
- As **datas** de criação e atualização são preenchidas automaticamente pelo sistema
- Erros de validação retornam HTTP `400 Bad Request` com mensagem descritiva em JSON
- Tarefa não encontrada retorna HTTP `404 Not Found`

---

## 💡 Decisões Técnicas

- **DTOs separados da entidade** evitam acoplamento entre persistência e contrato REST.
- **MapStruct** reduz código manual de conversão e mantém type safety em tempo de compilação.
- **GlobalExceptionHandler** garante respostas de erro padronizadas em JSON para o frontend.
- **Perfis dev/prod** separam configuração local (H2/MySQL dev) de configuração produtiva.
- **Paginação e filtros no backend** evitam carregar dados excessivos no frontend.
- **Standalone Components** reduzem boilerplate no Angular moderno.
- **Signals** foram usados para estado local simples de UI, preservando legibilidade.
- **Docker Compose** permite executar toda a aplicação com um único comando.

---

## 🗺️ Diferenciais Implementados

- [x] Paginação na listagem
- [x] Busca por título (parcial)
- [x] Filtro por status
- [x] Ordenação por data
- [x] Testes unitários (Mockito)
- [x] Testes de integração (MockMvc + H2)
- [x] Validação com Bean Validation
- [x] Swagger / OpenAPI
- [x] Angular Material
- [x] Tratamento global de exceções
- [x] Arquitetura em camadas bem definida
- [x] Uso de DTOs
- [x] MapStruct
- [x] Lombok
- [x] Configuração de perfis (dev/prod)
- [x] Docker (backend + frontend + docker-compose)

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License**.

---

## 👤 Autor

<p align="center">
  Desenvolvido com ☕ por <a href="https://github.com/ReiArthurjpg"><strong>ReiArthurjpg</strong></a><br>
  Teste Prático — Desenvolvedor Fullstack Inova
</p>

<p align="center">
  <a href="https://github.com/ReiArthurjpg/To-Do-List/issues">🐛 Reportar Bug</a> ·
  <a href="https://github.com/ReiArthurjpg/To-Do-List/issues">✨ Solicitar Feature</a>
</p>
