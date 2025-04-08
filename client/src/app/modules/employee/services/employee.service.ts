import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../../auth/services/storage/storage.service';
import { Observable } from 'rxjs';
import { TaskDto } from '../../../shared/models/task-dto.model';
import { User } from '../../../shared/models/user.model';

const BASE_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  getEmployeeTasksById(): Observable<TaskDto[]> {
      return this.http.get<TaskDto[]>(BASE_URL + "api/employee/tasks", {
        headers: this.createAuthorizationHeader(),
      });
  }

  updateTaskStatus(id: number, status: string): Observable<TaskDto> {
    return this.http.patch<TaskDto>(
      `${BASE_URL}api/employee/task/${id}/status/${status}`,
      {},
      { headers: this.createAuthorizationHeader() }
    );
  }

  searchTask(title: string): Observable<TaskDto[]> {
      return this.http.get<TaskDto[]>(`${BASE_URL}api/employee/tasks/search/${title}`, {
        headers: this.createAuthorizationHeader(),
      });
  }

  getLoggedInUser(): Observable<User> {
    return this.http.get<User>(`${BASE_URL}api/employee/me`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${BASE_URL}api/employee/upload-image`, formData, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateUserProfileImage(userId: number, imageName: string): Observable<string> {
    return this.http.put<string>(`${BASE_URL}api/employee/user/${userId}/profile-image`, null, {
      params: { imageName },
      headers: this.createAuthorizationHeader(),
    });
  }

  getTaskById(id: number): Observable<TaskDto> {
      return this.http.get<TaskDto>(`${BASE_URL}api/employee/task/${id}`, {
        headers: this.createAuthorizationHeader(),
      });
    }
  
    createComment(id: number, content: string): Observable<any> {
      const params = {
        content: content
      }
      return this.http.post(`${BASE_URL}api/employee/task/${id}/comment`, null, {
        params: params,
        headers: this.createAuthorizationHeader(),
      });
    }
  
    getCommentsByTaskId(id: number): Observable<any[]> {
      return this.http.get<any[]>(`${BASE_URL}api/employee/task/${id}/comments`, {
        headers: this.createAuthorizationHeader(),
      });
    }

  private createAuthorizationHeader(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
