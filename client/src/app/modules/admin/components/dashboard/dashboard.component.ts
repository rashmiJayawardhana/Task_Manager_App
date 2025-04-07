import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
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
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  listOfTasks: TaskDto[] | undefined;
  searchForm: FormGroup;
  isLoading = false;
  isDeleting: { [key: number]: boolean } = {};
  private destroy$ = new Subject<void>();

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
        debounceTime(300), // Wait 300ms after the last input
        distinctUntilChanged(), // Only emit if the value has changed
        takeUntil(this.destroy$)
      )
      .subscribe((title) => {
        if (title && title.trim().length > 0) {
          this.searchTask(title);
        } else {
          this.getTasks(); // Reset to all tasks if search is cleared
        }
      });
  }

  onSearchInput() {
    // Triggered on input, but the actual search is handled by the valueChanges subscription
  }

  // Helper method to assign a numerical value to priority for sorting
  private getPriorityValue(priority: string | null | undefined): number {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 3;
      case 'MEDIUM':
        return 2;
      case 'LOW':
        return 1;
      default:
        return 0; // Handle unknown priorities (e.g., null or undefined)
    }
  }

  // Helper method to assign a numerical value to task status for sorting
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
        return 0; // Handle unknown statuses
    }
  }

  // Helper method to sort tasks by priority, status, and due date
  private sortTasks(tasks: TaskDto[]): TaskDto[] {
    return tasks.sort((a, b) => {
      // 1. Compare by priority (High > Medium > Low)
      const priorityA = this.getPriorityValue(a.priority);
      const priorityB = this.getPriorityValue(b.priority);
      if (priorityA !== priorityB) {
        return priorityB - priorityA; // Descending order (High first)
      }

      // 2. If priorities are equal, compare by task status (InProgress > Pending > Deferred > Cancelled > Completed)
      const statusA = this.getStatusValue(a.taskStatus);
      const statusB = this.getStatusValue(b.taskStatus);
      if (statusA !== statusB) {
        return statusB - statusA; // Descending order (InProgress first)
      }

      // 3. If statuses are equal, compare by due date (earliest first)
      const dueDateA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER; // Handle null due dates
      const dueDateB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return dueDateA - dueDateB; // Ascending order (earliest due date first)
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
        // Sort the tasks after mapping
        this.listOfTasks = this.sortTasks(this.listOfTasks);
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
        // Sort the tasks after mapping
        this.listOfTasks = this.sortTasks(this.listOfTasks);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error searching tasks:', err);
        this.snackbar.open('Failed to search tasks. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        this.listOfTasks = [];
        this.isLoading = false;
      },
    });
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
}