import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/services/storage/storage.service';
import { Employee } from '../../../shared/models/employee.model';
import { TaskDto } from '../../../shared/models/task-dto.model';

const BASE_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  getUsers(): Observable<Employee[]> {
    return this.http.get<Employee[]>(BASE_URL + "api/admin/users", {
      headers: this.createAuthorizationHeader(),
    });
  }

  postTask(task: TaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(BASE_URL + "api/admin/task", task, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllTasks(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(BASE_URL + "api/admin/tasks", {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}api/admin/task/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getTaskById(id: number): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${BASE_URL}api/admin/task/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateTask(id: number, task: TaskDto): Observable<TaskDto> {
    return this.http.put<TaskDto>(`${BASE_URL}api/admin/task/${id}`, task, {
      headers: this.createAuthorizationHeader(),
    });
  }

  searchTask(title: string): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${BASE_URL}api/admin/tasks/search/${title}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  createComment(id: number, content: string): Observable<any> {
    const params = {
      content: content
    }
    return this.http.post(`${BASE_URL}api/admin/task/comment/${id}`, null, {
      params: params,
      headers: this.createAuthorizationHeader(),
    });
  }

  getCommentsByTaskId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${BASE_URL}api/admin/task/${id}/comments`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  private createAuthorizationHeader(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}