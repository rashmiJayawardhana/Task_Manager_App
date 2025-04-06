import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../auth/services/storage/storage.service';

const BASE_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService // Inject StorageService
  ) {}

  getUsers(): Observable<any> {
    return this.http.get(BASE_URL + "api/admin/users", {
      headers: this.createAuthorizationHeader(),
    });
  }

  private createAuthorizationHeader(): HttpHeaders {
    const token = this.storageService.getToken(); // Use instance method
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}