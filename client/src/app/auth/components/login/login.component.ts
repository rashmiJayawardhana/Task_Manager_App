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
    private router: Router
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
          // Only handle the success case here
          if (res.jwt && res.userId != null) {
            console.log('Login Input Data:', this.loginForm.value);
            console.log('Login Successful! User ID:', res.userId, 'Role:', res.userRole);

            // Store the JWT token
            localStorage.setItem('jwt', res.jwt);

            // Show success message
            this.snackbar.open('Login successful', 'Close', {
              duration: 5000,
              panelClass: ['success-snackbar'],
            });

            // Redirect to dashboard
            this.router.navigateByUrl('/dashboard');
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          let errorMessage = 'Login failed. Please try again.';
          if (err.status === 401) {
            errorMessage = 'Invalid email or password. Please try again.';
          } else if (err.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
          } else if (err.error?.message) {
            errorMessage = err.error.message;
          }
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