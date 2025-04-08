import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'; // Added for pagination
import { AdminService } from '../../services/admin.service';
import { TaskDto } from '../../../../shared/models/task-dto.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
    MatPaginatorModule, // Added
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  listOfTasks: TaskDto[] | undefined;
  paginatedTasks: TaskDto[] = []; // Tasks to display on the current page
  taskCounts: { [key: string]: number } = {
    PENDING: 0,
    INPROGRESS: 0,
    COMPLETED: 0,
    DEFERRED: 0,
    CANCELLED: 0,
  };
  searchForm: FormGroup;
  isLoading = false;
  isDeleting: { [key: number]: boolean } = {};
  private destroy$ = new Subject<void>();
  pageSize = 9; // Number of tasks per page
  currentPage = 0; // Current page index

  constructor(
    private service: AdminService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      title: [null],
    });
  }

  ngOnInit() {
    this.getTasks();
    this.setupSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSearch() {
    this.searchForm
      .get('title')!
      .valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((title) => {
        if (title && title.trim().length > 0) {
          this.searchTask(title);
        } else {
          this.getTasks();
        }
      });
  }

  onSearchInput() {
    // Triggered on input, but the actual search is handled by the valueChanges subscription
  }

  private getPriorityValue(priority: string | null | undefined): number {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 3;
      case 'MEDIUM':
        return 2;
      case 'LOW':
        return 1;
      default:
        return 0;
    }
  }

  private getStatusValue(status: string | null | undefined): number {
    switch (status?.toUpperCase()) {
      case 'INPROGRESS':
        return 5;
      case 'PENDING':
        return 4;
      case 'DEFERRED':
        return 3;
      case 'CANCELLED':
        return 2;
      case 'COMPLETED':
        return 1;
      default:
        return 0;
    }
  }

  private sortTasks(tasks: TaskDto[]): TaskDto[] {
    return tasks.sort((a, b) => {
      const priorityA = this.getPriorityValue(a.priority);
      const priorityB = this.getPriorityValue(b.priority);
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }

      const statusA = this.getStatusValue(a.taskStatus);
      const statusB = this.getStatusValue(b.taskStatus);
      if (statusA !== statusB) {
        return statusB - statusA;
      }

      const dueDateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const dueDateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return dueDateA - dueDateB;
    });
  }

  getTasks() {
    this.isLoading = true;
    this.service.getAllTasks().subscribe({
      next: (res) => {
        this.listOfTasks = res.map((task) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          priority: task.priority ?? 'UNKNOWN',
          taskStatus: task.taskStatus ?? 'UNKNOWN',
        }));
        this.listOfTasks = this.sortTasks(this.listOfTasks);
        this.updateTaskCounts();
        this.updatePaginatedTasks();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.snackbar.open('Failed to load tasks. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        this.isLoading = false;
      },
    });
  }

  searchTask(title: string) {
    this.isLoading = true;
    this.service.searchTask(title).subscribe({
      next: (res) => {
        this.listOfTasks = res.map((task) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          priority: task.priority ?? 'UNKNOWN',
          taskStatus: task.taskStatus ?? 'UNKNOWN',
        }));
        this.listOfTasks = this.sortTasks(this.listOfTasks);
        this.updateTaskCounts();
        this.currentPage = 0; // Reset to first page on search
        this.updatePaginatedTasks();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error searching tasks:', err);
        this.snackbar.open('Failed to search tasks. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        this.listOfTasks = [];
        this.updateTaskCounts();
        this.updatePaginatedTasks();
        this.isLoading = false;
      },
    });
  }

  private updateTaskCounts() {
    this.taskCounts = {
      PENDING: 0,
      INPROGRESS: 0,
      COMPLETED: 0,
      DEFERRED: 0,
      CANCELLED: 0,
    };
    if (this.listOfTasks) {
      this.listOfTasks.forEach(task => {
        const status = task.taskStatus?.toUpperCase();
        if (status && this.taskCounts.hasOwnProperty(status)) {
          this.taskCounts[status]++;
        }
      });
    }
  }

  getTaskCount(status: string): number {
    return this.taskCounts[status.toUpperCase()] || 0;
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.isDeleting[id] = true;
      this.service.deleteTask(id).subscribe({
        next: () => {
          this.snackbar.open('Task deleted successfully', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar'],
          });
          this.getTasks(); // Refresh the task list
          this.isDeleting[id] = false;
        },
        error: (err) => {
          console.error('Error deleting task:', err);
          this.snackbar.open('Failed to delete task. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
          this.isDeleting[id] = false;
        },
      });
    }
  }

  getPriorityClass(priority: string | null | undefined): string {
    return `priority-${(priority ?? 'unknown').toLowerCase()}`;
  }

  getStatusClass(status: string | null | undefined): string {
    return `status-${(status ?? 'unknown').toLowerCase()}`;
  }

  // Pagination logic
  private updatePaginatedTasks() {
    if (!this.listOfTasks) {
      this.paginatedTasks = [];
      return;
    }
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTasks = this.listOfTasks.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedTasks();
  }
}