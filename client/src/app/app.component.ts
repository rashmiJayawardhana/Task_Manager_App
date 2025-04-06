import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from './auth/services/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';

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
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private storageService: StorageService) {}

  ngOnInit() {
    // Subscribe to login state changes
    this.storageService
      .getLoginState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ isAdmin, isEmployee }) => {
        this.isAdminLoggedIn = isAdmin;
        this.isEmployeeLoggedIn = isEmployee;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.storageService.logout();
    this.router.navigateByUrl('/login');
  }
}