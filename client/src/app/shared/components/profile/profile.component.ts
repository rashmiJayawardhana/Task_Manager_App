import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StorageService } from '../../../auth/services/storage/storage.service';
import { AdminService } from '../../../modules/admin/services/admin.service';
import { EmployeeService } from '../../../modules/employee/services/employee.service';
import { User } from '../../../shared/models/user.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userProfile: User | null = null;
  selectedFile: File | null = null;
  isAdmin: boolean = false;
  isEmployee: boolean = false;
  static profileUpdated = new Subject<void>();

  constructor(
    private storageService: StorageService,
    private adminService: AdminService,
    private employeeService: EmployeeService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isAdmin = this.storageService.isAdminLoggedIn();
    this.isEmployee = this.storageService.isEmployeeLoggedIn();
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    if (this.isAdmin) {
      this.adminService.getLoggedInUser().subscribe({
        next: (user: User) => {
          this.userProfile = user;
        },
        error: (err: any) => {
          this.snackbar.open('Failed to load profile', 'Close', { duration: 5000 });
        }
      });
    } else if (this.isEmployee) {
      this.employeeService.getLoggedInUser().subscribe({
        next: (user: User) => {
          this.userProfile = user;
        },
        error: (err: any) => {
          this.snackbar.open('Failed to load profile', 'Close', { duration: 5000 });
        }
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage() {
    if (!this.selectedFile) {
      this.snackbar.open('Please select an image to upload', 'Close', { duration: 5000 });
      return;
    }

    const uploadService = this.isAdmin ? this.adminService : this.employeeService;
    uploadService.uploadImage(this.selectedFile).subscribe({
      next: (imageName: string) => {
        uploadService.updateUserProfileImage(this.userProfile!.id, imageName).subscribe({
          next: () => {
            this.snackbar.open('Profile image updated successfully', 'Close', { duration: 5000 });
            this.selectedFile = null;
            this.fetchUserProfile();
            ProfileComponent.profileUpdated.next();
          },
          error: (err: any) => {
            this.snackbar.open(err.error?.message || 'Failed to update profile image', 'Close', { duration: 5000 });
          }
        });
      },
      error: (err: any) => {
        this.snackbar.open(err.error?.message || 'Failed to upload image', 'Close', { duration: 5000 });
      }
    });
  }
}