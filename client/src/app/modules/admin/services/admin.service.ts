// admin.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/services/storage/storage.service';
import { Employee } from '../../../shared/models/employee.model';
import { Task } from '../../../shared/models/task.model';

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

  postTask(task: Task): Observable<any> {
    return this.http.post(BASE_URL + "api/admin/task", task, {
      headers: this.createAuthorizationHeader(),
    });
  }

  private createAuthorizationHeader(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}