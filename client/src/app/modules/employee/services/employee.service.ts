import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from '../../../auth/services/storage/storage.service';
import { Observable } from 'rxjs';
import { TaskDto } from '../../../shared/models/task-dto.model';

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

  private createAuthorizationHeader(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
