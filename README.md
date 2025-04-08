# Task Manager Web Application

Welcome to the **Task Manager Web Application**! This is a full-stack application built with **Angular** for the frontend, **Spring Boot** for the backend, and **MySQL** as the database. The app allows users to manage tasks (create, view, edit, and delete) and includes advanced features like JWT-based authentication and Docker deployment.

## 📋 Project Overview

The Task Manager app provides a user-friendly interface for employees to manage tasks within an organization. It includes an Employee module with a detailed Task Details page where employees can:

- View task details by task ID.
- See comments posted on a task by task ID.
- Post new comments on tasks.

The application is built with a modern tech stack and follows best practices for modularity, scalability, and security.

## 🛠️ Tech Stack

- **Frontend**: Angular 17, Angular Material, TypeScript, SCSS
- **Backend**: Spring Boot 3, Spring Security, Spring Data JPA, Java 17
- **Database**: MySQL 8
- **Authentication**: JSON Web Tokens (JWT)
- **Containerization**: Docker, Docker Compose
- **Version Control**: Git, GitHub

## ✨ Features

### General Features
- **Task Management**:
  - Create, read, update, and delete (CRUD) tasks.
  - Filter tasks by status (e.g., TO_DO, IN_PROGRESS, DONE).
  - View detailed task information on a Task Details page.
- **Comment System**:
  - Employees can view comments associated with a specific task.
  - Employees can post new comments on tasks.
- **Responsive UI**:
  - Built with Angular Material for a clean and modern user interface.
  - Supports navigation between Task List, Task Form, and Task Details pages.

### Backend (Spring Boot)
- RESTful API for task management.
- JWT-based authentication for secure access to endpoints.
- Integration with MySQL database using Spring Data JPA.
- Role-based authorization (e.g., Employee, Admin).

### Frontend (Angular)
- Single Page Application (SPA) built with Angular.
- Angular Material components for UI consistency.
- Client-side routing with Angular Router.
- HTTP client for interacting with the Spring Boot REST API.
- Displays error messages for API failures.
- Task List Page: Displays tasks in a table with status filtering.
- Task Form Page: Add/edit tasks using Reactive Forms with validation.
- Task Details Page: Shows task info, comments, and a form to post comments.

### Security
- **JWT Authentication**: Secure login and token-based access to protected resources.
- Role-based access control (RBAC) implemented in the backend.

### Deployment
- Dockerized application for easy setup and deployment.
- Docker Compose support for running Angular frontend (served via Nginx), Spring Boot backend, and MySQL database together.

## Admin Dashboard
![Screenshot (190)](https://github.com/user-attachments/assets/24bbb6ec-16b3-4fcd-9f8c-664607353bb4)

## Sign Up
![Screenshot (194)](https://github.com/user-attachments/assets/2c3df6a5-3607-429a-a2a3-0aeac27a7fff)

## Login
![Screenshot (193)](https://github.com/user-attachments/assets/b81c05de-71c8-4e32-b776-aced82c84311)

## Add new task
![Screenshot (191)](https://github.com/user-attachments/assets/9cf74677-b1dd-4677-b9ec-f5277342ae9d)

## View task details, post comments, view comments
![Screenshot (192)](https://github.com/user-attachments/assets/ebbe5f87-bcb0-4e35-9398-cf3437b1e3bf)

## Edit task
![Screenshot (196)](https://github.com/user-attachments/assets/1d7b7828-91c9-4297-a0ba-af0053a045f6)

## Employee Dashboard
![Screenshot (195)](https://github.com/user-attachments/assets/8db091d3-3db2-4556-af03-d800c3a4e0b6)

## Project Structure
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





## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or later) and **npm** (v8 or later): [Download](https://nodejs.org/)
- **Angular CLI**: `npm install -g @angular/cli`
- **Java JDK** (17 or later): [Download](https://www.oracle.com/java/)
- **Maven**: [Download](https://maven.apache.org/)
- **MySQL**: [Download](https://dev.mysql.com/downloads/)
- **Docker**: [Download](https://www.docker.com/get-started)
- **Git**: [Download](https://git-scm.com/)

## Setup Instructions

### Option 1: Run with Docker Compose (Recommended)
### 1.Clone the Repository
```bash
git clone https://github.com/your-username/task-manager-web-app.git
cd task-manager-app

### 2. Set Up Environment Variables
```bash
cp .env.example .env

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

### 4. Access the Application
- Frontend: http://localhost
- Backend API: http://localhost:8080/api

### 5. Stop the Application
```bash
docker-compose down

### Option 2: Run Locally (Without Docker)
### 1.Clone the Repository
```bash
git clone https://github.com/your-username/task-manager-app.git
cd task-manager-app

### 2. Set Up the Database
Create a database named task_manager_db and update:
spring.datasource.url=jdbc:mysql://localhost:3306/task_manager_db
spring.datasource.username=youre username
spring.datasource.password=your password
spring.jpa.hibernate.ddl-auto=update

### 3. Run the Backend
```bash
cd server
mvn clean install
mvn spring-boot:run

### 4. Run the Frontend
```bash
cd client
npm install
ng serve

### 5. Access the Application
- Frontend: http://localhost:4200
- Backend: http://localhost:8080/api

### 5. Stop the Application
```bash
docker-compose down

## Resources
- Angular Docs
- Spring Boot Docs
- Docker Docs
- JWT Authentication




