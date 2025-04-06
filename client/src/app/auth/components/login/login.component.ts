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

// Define the expected response type from the API
interface LoginResponse {
  jwt: string;
  userId: number | string;
  userRole: string;
  message?: string; // For error messages
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router,
    private storageService: StorageService 
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]], 
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res: LoginResponse) => {
          if (res.jwt && res.userId != null) {
            // Save user and token using StorageService
            const user = {
              id: res.userId,
              role: res.userRole,
            };
            StorageService.saveUser(user);
            StorageService.saveToken(res.jwt);

            // Log input data and success message
            console.log('Login Input Data:', this.loginForm.value);
            console.log('Login Successful! User ID:', res.userId, 'Role:', res.userRole);
            console.log('Stored User:', StorageService.getUser());
            console.log('Is Admin:', StorageService.isAdminLoggedIn());
            console.log('Is Employee:', StorageService.isEmployeeLoggedIn());

            // Show success message
            this.snackbar.open('Login successful', 'Close', {
              duration: 5000,
              panelClass: ['success-snackbar'],
            });

            // Redirect based on user role
          if (StorageService.isAdminLoggedIn()) {
            console.log('Navigating to admin/dashboard');
            this.router.navigate(['admin', 'dashboard']).catch((err) => {
              console.error('Navigation to admin/dashboard failed:', err);
              this.snackbar.open('Navigation failed. Please try again.', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
              });
            });
          } else if (StorageService.isEmployeeLoggedIn()) {
            console.log('Navigating to employee/dashboard');
            this.router.navigate(['employee', 'dashboard']).catch((err) => {
              console.error('Navigation to employee/dashboard failed:', err);
              this.snackbar.open('Navigation failed. Please try again.', 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
              });
            });
          } else {
            console.error('Unknown role:', res.userRole);
            this.snackbar.open('Unknown user role. Please contact support.', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          }
        }
      },
        error: (err) => {
          console.error('Login error:', err);
          const errorMessage =
            err.status === 401
              ? 'Invalid email or password. Please try again.'
              : err.error?.message || 'Login failed. Please try again.';
          this.snackbar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });

      // Reset the form
      this.loginForm.reset();
    }
  }
}