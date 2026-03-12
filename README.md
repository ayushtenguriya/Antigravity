# 🏢 Job Application Platform

A full-stack, microservices-based job portal where **job seekers** can discover and apply for jobs, **employers** can post and manage listings, and **admins** can oversee the entire platform.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Angular Frontend                     │
│              (job-portal-ui — port 4200)                 │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP
                        ▼
┌─────────────────────────────────────────────────────────┐
│               API Gateway (port 8080)                    │
│           JWT validation · Route distribution            │
└───┬────────────┬───────────────┬────────────────┬───────┘
    │            │               │                │
    ▼            ▼               ▼                ▼
┌────────┐  ┌─────────┐  ┌───────────┐  ┌──────────────┐
│ User   │  │  Job    │  │Application│  │Notification  │
│Service │  │ Service │  │  Service  │  │   Service    │
│ :8081  │  │  :8082  │  │   :8083   │  │    :8084     │
└────────┘  └─────────┘  └───────────┘  └──────────────┘
    │            │               │                │
    └────────────┴───────────────┴────────────────┘
                        │ Eureka
                        ▼
┌─────────────────────────────────────────────────────────┐
│           Eureka Service Registry (port 8761)            │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 👤 Authentication & Authorization

- JWT-based stateless authentication
- Role-based access control: **JOB_SEEKER**, **EMPLOYER**, **ADMIN**
- Secure registration and login

### 💼 Job Management

- Browse and search job listings (public)
- Employers can create, edit, and delete their own job postings
- Detailed job view with apply button

### 📋 Applications

- Job seekers can apply to open positions
- Employers can view all applicants for their jobs
- Application status tracking

### 📊 Dashboard

- Personalized dashboard for each user role
- Employers see their posted jobs and application stats
- Job seekers see their active applications

### 🛡️ Admin Panel

- View and manage all registered users
- Platform-wide oversight

### 🔔 Notifications

- Automated notifications on application events via the Notification Service

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Angular 17, Angular Material, RxJS |
| **Backend** | Spring Boot 3.2, Spring Security, Spring Cloud |
| **API Gateway** | Spring Cloud Gateway + JWT filter |
| **Service Discovery** | Netflix Eureka |
| **Database** | H2 (in-memory, per service) |
| **Auth** | JWT (JJWT 0.11.5) |
| **Containerization** | Docker, Docker Compose |

---

## 📁 Project Structure

```
job-application/
├── docker-compose.yml
├── backend/
│   ├── eureka-server/          # Service registry (port 8761)
│   ├── api-gateway/            # Gateway + JWT validation (port 8080)
│   ├── user-service/           # Auth & user management (port 8081)
│   ├── job-service/            # Job CRUD (port 8082)
│   ├── application-service/    # Job applications (port 8083)
│   └── notification-service/   # Event notifications (port 8084)
└── frontend/
    └── job-portal-ui/          # Angular 17 SPA (port 4200)
        └── src/app/
            ├── core/
            │   ├── guards/     # AuthGuard, RoleGuard
            │   ├── interceptors/
            │   └── services/   # Auth, Job, Application, User services
            └── pages/
                ├── login/
                ├── register/
                ├── jobs/       # List, Detail, Form
                ├── dashboard/
                ├── applications/
                └── admin/
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker** & **Docker Compose** — for the full containerized stack
- **Java 17** + **Maven** — for running backend services individually
- **Node.js 18+** + **Angular CLI 17** — for the frontend

---

### ▶️ Option 1 — Docker Compose (Recommended)

Spin up all backend services with a single command:

```bash
cd job-application
docker-compose up --build
```

Services will start in dependency order (Eureka → backend services → API Gateway). Once healthy, the API is available at `http://localhost:8080`.

> **Note:** The frontend is not included in Docker Compose. Run it separately (see Option 2 below).

**Stop everything:**

```bash
docker-compose down
```

---

### ▶️ Option 2 — Run Frontend Locally

```bash
cd job-application/frontend/job-portal-ui
npm install
ng serve
```

The Angular app will be available at `http://localhost:4200`.

---

### ▶️ Option 3 — Run Backend Services Individually

Each service is a standard Spring Boot application:

```bash
# 1. Start Eureka first
cd backend/eureka-server
mvn spring-boot:run

# 2. Start the other services (each in a separate terminal)
cd backend/user-service        && mvn spring-boot:run
cd backend/job-service         && mvn spring-boot:run
cd backend/application-service && mvn spring-boot:run
cd backend/notification-service && mvn spring-boot:run
cd backend/api-gateway         && mvn spring-boot:run
```

---

## 🔌 Service Endpoints

| Service | Port | Base URL |
|---|---|---|
| Eureka Dashboard | 8761 | <http://localhost:8761> |
| API Gateway | 8080 | <http://localhost:8080> |
| User Service | 8081 | <http://localhost:8081> |
| Job Service | 8082 | <http://localhost:8082> |
| Application Service | 8083 | <http://localhost:8083> |
| Notification Service | 8084 | <http://localhost:8084> |
| Frontend (Angular) | 4200 | <http://localhost:4200> |

All client requests should go through the **API Gateway** (`http://localhost:8080`).

---

## 🔑 API Reference (via Gateway)

### Auth

| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/api/users/register` | Register a new user | None |
| `POST` | `/api/users/login` | Login and get JWT | None |

### Jobs

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/api/jobs` | List all jobs | None |
| `GET` | `/api/jobs/{id}` | Get job details | None |
| `POST` | `/api/jobs` | Create a job | EMPLOYER |
| `PUT` | `/api/jobs/{id}` | Update a job | EMPLOYER |
| `DELETE` | `/api/jobs/{id}` | Delete a job | EMPLOYER |

### Applications

| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/api/applications` | Apply for a job | JOB_SEEKER |
| `GET` | `/api/applications/job/{jobId}` | Applicants for a job | EMPLOYER/ADMIN |
| `GET` | `/api/applications/user` | My applications | JOB_SEEKER |

### Users (Admin)

| Method | Path | Description | Auth |
|---|---|---|---|
| `GET` | `/api/users` | List all users | ADMIN |

---

## 👥 User Roles

| Role | Capabilities |
|---|---|
| **JOB_SEEKER** | Browse & apply to jobs, view own applications, dashboard |
| **EMPLOYER** | Post/edit/delete jobs, view applicants for own jobs, dashboard |
| **ADMIN** | All above + manage all platform users |

---

## 🔐 Authentication Flow

1. Register via `POST /api/users/register` with `role` field (`JOB_SEEKER` or `EMPLOYER`)
2. Login via `POST /api/users/login` — returns a **JWT token**
3. Include the token in all subsequent requests:

   ```
   Authorization: Bearer <your-jwt-token>
   ```

4. The **API Gateway** validates the JWT before forwarding to downstream services

---

## 🏥 Health Checks

Each service exposes Spring Actuator health endpoints:

```
http://localhost:{port}/actuator/health
```

Docker Compose uses these to enforce correct startup ordering.

---

## 🛠️ Development Notes

- **H2 in-memory database**: Each service uses its own H2 database. Data resets on service restart. For persistence, replace with PostgreSQL/MySQL in `application.properties`.
- **CORS**: The API Gateway is configured to allow requests from `http://localhost:4200`.
- **JWT Secret**: Shared between `api-gateway` and `user-service` via `application.properties`. Change the secret before deploying to production.
- **Service discovery**: All services register with Eureka and are routed via the gateway using their service names.
