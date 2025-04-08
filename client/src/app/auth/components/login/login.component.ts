import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

interface LoginResponse {
  jwt: string;
  userId: number | string;
  userRole: string;
  message?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router,
    private storageService: StorageService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]], // Changed from email
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        const res: LoginResponse = await this.authService.login(this.loginForm.value).toPromise();
        if (res.jwt && res.userId != null) {
          const user = {
            id: res.userId,
            role: res.userRole,
          };
          this.storageService.saveUser(user);
          this.storageService.saveToken(res.jwt);

          console.log('Login Input Data:', this.loginForm.value);
          console.log('Login Successful! User ID:', res.userId, 'Role:', res.userRole);
          console.log('Stored User:', this.storageService.getUser());
          console.log('Is Admin:', this.storageService.isAdminLoggedIn());
          console.log('Is Employee:', this.storageService.isEmployeeLoggedIn());

          this.snackbar.open('Login successful', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar'],
          });

          try {
            if (this.storageService.isAdminLoggedIn()) {
              console.log('Navigating to admin/dashboard');
              await this.router.navigateByUrl('admin/dashboard');
            } else if (this.storageService.isEmployeeLoggedIn()) {
              console.log('Navigating to employee/dashboard');
              await this.router.navigateByUrl('employee/dashboard');
            } else {
              console.error('Unknown role:', res.userRole);
              this.snackbar.open('Unknown user role. Please contact support.', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
              });
            }
          } catch (navError) {
            console.error('Navigation failed:', navError);
            this.snackbar.open('Navigation failed. Please try again.', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          }
        }
      } catch (err) {
        console.error('Login error:', err);
        const errorMessage =
          (err as any).status === 401
            ? 'Invalid username or password. Please try again.'
            : (err as any).error?.message || 'Login failed. Please try again.';
        this.snackbar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      } finally {
        this.isLoading = false;
      }

      this.loginForm.reset();
    }
  }
}