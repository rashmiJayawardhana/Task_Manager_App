# ✅ Task Manager Web Application

Welcome to the **Task Manager Web Application** — a full-stack project designed for efficient task tracking within organizations. Built with **Angular** (frontend), **Spring Boot** (backend), and **MySQL**, this app supports task management, commenting, role-based access, JWT authentication, and Dockerized deployment.

---

## 📌 Table of Contents

- [📋 Project Overview](#-project-overview)
- [🛠️ Tech Stack](#-tech-stack)
- [✨ Features](#-features)
- [📸 Screenshots](#-screenshots)
- [🗂️ Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
  - [Option 1: Run with Docker (Recommended)](#option-1-run-with-docker-recommended)
  - [Option 2: Run Locally (Without Docker)](#option-2-run-locally-without-docker)
- [🔐 Credentials (JWT Auth)](#-credentials-jwt-auth)
- [📚 Resources](#-resources)

---

## 📋 Project Overview

The app provides a user-friendly interface for employees and admins to manage tasks effectively.

**Core Functionalities:**

- View, create, edit, and delete tasks.
- Filter tasks based on status.
- View and post comments on specific tasks.
- Authentication and role-based authorization.

---

## 🛠️ Tech Stack

| Layer       | Technologies |
|-------------|--------------|
| Frontend    | Angular 17, Angular Material, TypeScript, SCSS |
| Backend     | Spring Boot 3, Spring Security, Java 17, Spring Data JPA |
| Database    | MySQL 8 |
| Auth        | JWT (JSON Web Token) |
| Deployment  | Docker, Docker Compose |
| Versioning  | Git, GitHub |

---

## ✨ Features

### 🧾 General
- Task CRUD operations with status filters.
- Responsive UI with Angular Material.
- Comment system under each task.

### 🔐 Backend
- Secure REST APIs with JWT.
- Role-based access (Employee, Admin).
- MySQL with Spring Data JPA integration.

### 💻 Frontend
- Angular SPA with routing & validation.
- Task List, Task Form, and Task Detail pages.
- Error handling for API calls.

### 🛡️ Security
- JWT-based Authentication & Authorization.
- Role-based access for secure data handling.

### 📦 Deployment
- Dockerized backend, frontend, and MySQL.
- Docker Compose for single-command deployment.

---

## 📸 Screenshots

| View | Image |
|------|-------|
| Admin Dashboard | ![Admin Dashboard](https://github.com/user-attachments/assets/24bbb6ec-16b3-4fcd-9f8c-664607353bb4) |
| Sign Up | ![Sign Up](https://github.com/user-attachments/assets/2c3df6a5-3607-429a-a2a3-0aeac27a7fff) |
| Login | ![Login](https://github.com/user-attachments/assets/b81c05de-71c8-4e32-b776-aced82c84311) |
| Add Task | ![Add Task](https://github.com/user-attachments/assets/9cf74677-b1dd-4677-b9ec-f5277342ae9d) |
| View Task + Comments | ![View Task](https://github.com/user-attachments/assets/ebbe5f87-bcb0-4e35-9398-cf3437b1e3bf) |
| Edit Task | ![Edit Task](https://github.com/user-attachments/assets/1d7b7828-91c9-4297-a0ba-af0053a045f6) |
| Employee Dashboard | ![Employee Dashboard](https://github.com/user-attachments/assets/8db091d3-3db2-4556-af03-d800c3a4e0b6) |

---

## 🗂️ Project Structure

```
Task_Manager_App/
├── client/                    # Angular frontend
│   ├── src/                   # Source code
│   │   ├── app/              # Angular components, services, and modules
│   │    
│   │   └── styles.scss       # Global styles
│   ├── Dockerfile            # Frontend Dockerfile
│   ├── nginx.conf            # Nginx config
│   ├── angular.json
│   └── package.json
├── server/                    # Spring Boot backend
│   ├── src/                   # Source code
│   │   ├── main/             # Main code
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   ├── Dockerfile
│   └── pom.xml
├── docker-compose.yml
├── .env
└── README.md
```




## 🚀 Getting Started

### ✅ Prerequisites

Ensure you have the following installed:
- [Node.js (v16+)](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`
- [Java JDK 17+](https://www.oracle.com/java/)
- [Maven](https://maven.apache.org/)
- [MySQL](https://dev.mysql.com/downloads/)
- [Docker](https://www.docker.com/get-started)
- [Git](https://git-scm.com/)

---

## ⚙️ Setup Instructions

### Option 1: Run with Docker Compose (Recommended)

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-manager-app.git
cd task-manager-app
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
```

### Example .env
##### Docker Compose settings
#### COMPOSE_BAKE=true

##### MySQL settings
#### MYSQL_ROOT_PASSWORD="1234Rashmi2001#"
#### MYSQL_DATABASE=task_manager_db
#### MYSQL_APP_USER=app_user
#### MYSQL_APP_PASSWORD="SecurePass2025!"

##### Application settings
#### BACKEND_PORT=8080
#### FRONTEND_PORT=80


### 3. Run the Application
```bash
docker-compose up -d --build
```

### 4. Access the Application
- Frontend: http://localhost
- Backend API: http://localhost:8080/api

### 5. Stop the Application
```bash
docker-compose down
```

### Option 2: Run Locally (Without Docker)
### 1.Clone the Repository
```bash
git clone https://github.com/your-username/task-manager-app.git
cd task-manager-app
```

### 2. Set Up the MySQL Database
Create a database named task_manager_db. Then update the following properties in server/src/main/resources/application.properties:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/task_manager_db
spring.datasource.username=youre username
spring.datasource.password=your password
spring.jpa.hibernate.ddl-auto=update
```

### 3. Run the Backend
```bash
cd server
mvn clean install
mvn spring-boot:run
```

### 4. Run the Frontend
```bash
cd client
npm install
ng serve
```

### 5. Access the Application
- Frontend: http://localhost:4200
- Backend: http://localhost:8080/api


## Resources
- Angular Docs
- Spring Boot Docs
- Docker Docs
- JWT Authentication




