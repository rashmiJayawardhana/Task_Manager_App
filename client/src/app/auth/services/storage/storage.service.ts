import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const TOKEN = 'token';
const USER = 'user';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private loginState$ = new BehaviorSubject<{ isAdmin: boolean; isEmployee: boolean }>({
    isAdmin: this.isAdminLoggedIn(),
    isEmployee: this.isEmployeeLoggedIn(),
  });

  constructor() {}

  private updateLoginState() {
    this.loginState$.next({
      isAdmin: this.isAdminLoggedIn(),
      isEmployee: this.isEmployeeLoggedIn(),
    });
  }

  getLoginState(): Observable<{ isAdmin: boolean; isEmployee: boolean }> {
    return this.loginState$.asObservable();
  }

  saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.setItem(TOKEN, token);
    this.updateLoginState(); 
  }

  saveUser(user: any): void {
    window.localStorage.removeItem(USER);
    window.localStorage.setItem(USER, JSON.stringify(user));
    this.updateLoginState(); 
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }

  getUser(): any {
    const user = localStorage.getItem(USER);
    if (user === null) {
      return null;
    }
    return JSON.parse(user);
  }

  getUserRole(): string {
    const user = this.getUser();
    if (user == null) {
      return '';
    }
    const role = user.role ? String(user.role).toUpperCase() : '';
    return role === 'ADMIN' || role === 'USER' ? 'ADMIN' : role;
  }

  isAdminLoggedIn(): boolean {
    if (this.getToken() === null) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'ADMIN';
  }

  isEmployeeLoggedIn(): boolean {
    if (this.getToken() === null) {
      return false;
    }
    const role: string = this.getUserRole();
    return role === 'EMPLOYEE';
  }

  getUserId(): string {
    const user = this.getUser();
    if (user == null) {
      return '';
    }
    return user.id || '';
  }

  logout(): void {
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);
    this.updateLoginState();
  }
}