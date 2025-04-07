import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmployeeService } from '../../services/employee.service';
import { TaskDto } from '../../../../shared/models/task-dto.model';


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
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  listOfTasks: TaskDto[] = [];
  isLoading = false;
  listOfTaskStatuses: string[] = ['PENDING', 'INPROGRESS', 'DEFERRED', 'CANCELLED', 'COMPLETED'];
  isUpdating: { [key: number]: boolean } = {};

  constructor(
    private service: EmployeeService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getTasks();
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
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.snackbar.open('Failed to load tasks. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
        this.listOfTasks = [];
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
        this.getTasks(); // Refresh the task list from the backend
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

  getPriorityClass(priority: string | null | undefined): string {
    return `priority-${(priority ?? 'unknown').toLowerCase()}`;
  }

  getStatusClass(status: string | null | undefined): string {
    return `status-${(status ?? 'unknown').toLowerCase()}`;
  }
}