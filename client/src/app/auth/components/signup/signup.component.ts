import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

interface SignupResponse {
  id: number | string;
  name: string;
  username: string;
  userRole: string;
  profileImage: string;
  message?: string;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule,
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        name: ['', Validators.required],
        username: ['', [Validators.required, Validators.pattern(/^[a-z0-9]+$/), this.lowercaseValidator]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  // Custom validator to ensure the username is lowercase
  lowercaseValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && value !== value.toLowerCase()) {
      return { notLowercase: true };
    }
    return null;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const { name, username, password } = this.signupForm.value;
      const signupRequest = { name, username, password };
      this.authService.signup(signupRequest).subscribe({
        next: (res: SignupResponse) => {
          if (res.id != null) {
            console.log('Signup Input Data:', signupRequest);
            console.log('Signup Successful! User ID:', res.id);
            this.snackbar.open('Signup successful', 'Close', {
              duration: 5000,
              panelClass: ['success-snackbar'],
            });
            this.router.navigateByUrl('/login');
          } else {
            this.snackbar.open('Signup failed. Try again', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          }
        },
        error: (err) => {
          console.error('Signup error:', err);
          const errorMessage = err.error?.message || 'Signup failed. Please try again.';
          this.snackbar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });

      this.signupForm.reset();
    }
  }
}