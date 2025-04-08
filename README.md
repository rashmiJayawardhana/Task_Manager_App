# Task Manager Web Application

Welcome to the **Task Manager Web Application**! This is a full-stack application built with **Angular** for the frontend, **Spring Boot** for the backend, and **MySQL** as the database. The app allows users to manage tasks (create, view, edit, and delete) and includes advanced features like JWT-based authentication and Docker deployment.

## 📋 Project Overview

The Task Manager app provides a user-friendly interface for employees to manage tasks within an organization. It includes an Employee module with a detailed Task Details page where employees can:

- View task details by task ID.
- See comments posted on a task by task ID.
- Post new comments on tasks.

The application is built with a modern tech stack and follows best practices for modularity, scalability, and security.

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

### Security
- **JWT Authentication**: Secure login and token-based access to protected resources.
- Role-based access control (RBAC) implemented in the backend.

### Deployment
- Dockerized application for easy setup and deployment.
- Docker Compose support for running Angular, Spring Boot, and MySQL together.

## 🛠️ Tech Stack

- **Frontend**: Angular 17, Angular Material, TypeScript, SCSS
- **Backend**: Spring Boot 3, Spring Security, Spring Data JPA, Java 17
- **Database**: MySQL 8
- **Authentication**: JSON Web Tokens (JWT)
- **Containerization**: Docker, Docker Compose
- **Version Control**: Git, GitHub

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or later) and **npm** (v8 or later): [Download](https://nodejs.org/)
- **Angular CLI**: `npm install -g @angular/cli`
- **Java JDK** (17 or later): [Download](https://www.oracle.com/java/)
- **Maven**: [Download](https://maven.apache.org/)
- **MySQL**: [Download](https://dev.mysql.com/downloads/)
- **Docker**: [Download](https://www.docker.com/get-started)
- **Git**: [Download](https://git-scm.com/)

## 🚀 Setup Instructions

### Clone the Repository
```bash
git clone https://github.com/your-username/task-manager-web-app.git
cd task-manager-web-app

### Backend Setup (Spring Boot)
####Navigate to the Backend Directory:
