import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from './auth/services/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { AdminService } from './modules/admin/services/admin.service';
import { EmployeeService } from './modules/employee/services/employee.service';
import { ProfileComponent } from './shared/components/profile/profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isAdminLoggedIn: boolean = false;
  isEmployeeLoggedIn: boolean = false;
  userProfile: any = null;
  private destroy$ = new Subject<void>();
  
  constructor(
    private router: Router, 
    private storageService: StorageService,
    private adminService: AdminService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    // Subscribe to login state changes
    this.storageService.getLoginState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isAdmin, isEmployee }) => {
        this.isAdminLoggedIn = isAdmin;
        this.isEmployeeLoggedIn = isEmployee;
        this.fetchUserProfile(); // Fetch the user profile whenever the login state changes
      });

    // Subscribe to profile updates
    ProfileComponent.profileUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchUserProfile(); // Refresh the profile image in the navbar
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchUserProfile() {
    if (this.isAdminLoggedIn) {
      this.adminService.getLoggedInUser().subscribe({
        next: (user) => {
          this.userProfile = user;
        },
        error: (err) => {
          console.error('Error fetching admin profile:', err);
        }
      });
    } else if (this.isEmployeeLoggedIn) {
      this.employeeService.getLoggedInUser().subscribe({
        next: (user) => {
          this.userProfile = user;
        },
        error: (err) => {
          console.error('Error fetching employee profile:', err);
        }
      });
    } else {
      this.userProfile = null; // Clear the user profile if not logged in
    }
  }

  logout() {
    this.storageService.logout();
    this.router.navigateByUrl('/login');
  }
}