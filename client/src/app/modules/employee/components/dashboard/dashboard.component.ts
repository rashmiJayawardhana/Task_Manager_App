import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EmployeeService } from '../../services/employee.service';
import { TaskDto } from '../../../../shared/models/task-dto.model';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  listOfTasks: TaskDto[] | undefined;
  paginatedTasks: TaskDto[] = [];
  taskCounts: { [key: string]: number } = {
    PENDING: 0,
    INPROGRESS: 0,
    COMPLETED: 0,
    DEFERRED: 0,
    CANCELLED: 0,
  };
  searchForm: FormGroup;
  isLoading = false;
  listOfTaskStatuses: string[] = ['PENDING', 'INPROGRESS', 'DEFERRED', 'CANCELLED', 'COMPLETED'];
  isUpdating: { [key: number]: boolean } = {};
  private destroy$ = new Subject<void>();
  pageSize = 9;
  currentPage = 0;

  constructor(
    private service: EmployeeService,
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

  getTasks() {
    this.isLoading = true;
    this.service.getEmployeeTasksById().subscribe({
      next: (res) => {
        this.listOfTasks = res.map((task) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          priority: task.priority ?? 'UNKNOWN',
          taskStatus: task.taskStatus ?? 'UNKNOWN',
        }));
        this.updateTaskCounts();
        this.currentPage = 0; 
        this.updatePaginatedTasks();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.snackbar.open('Failed to load tasks. Please try again.', 'Close', {
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

  updateTaskStatus(taskId: number, newStatus: string) {
    this.isUpdating[taskId] = true;
    this.service.updateTaskStatus(taskId, newStatus).subscribe({
      next: (updatedTask) => {
        this.snackbar.open('Task status updated successfully', 'Close', {
          duration: 5000,
          panelClass: ['success-snackbar'],
        });
        this.getTasks();
        this.isUpdating[taskId] = false;
      },
      error: (err) => {
        console.error('Error updating task status:', err);
        this.snackbar.open('Failed to update task status. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        this.isUpdating[taskId] = false;
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

  getPriorityClass(priority: string | null | undefined): string {
    return `priority-${(priority ?? 'unknown').toLowerCase()}`;
  }

  getStatusClass(status: string | null | undefined): string {
    return `status-${(status ?? 'unknown').toLowerCase()}`;
  }

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