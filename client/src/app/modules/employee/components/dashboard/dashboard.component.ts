import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  listOfTasks: TaskDto[] = [];
  isLoading = false;

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
          dueDate: new Date(task.dueDate), // Ensure dueDate is a Date object
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

  // Method to apply CSS classes based on priority
  getPriorityClass(priority: string | null | undefined): string {
    return `priority-${(priority ?? 'unknown').toLowerCase()}`;
  }

  // Method to apply CSS classes based on task status
  getStatusClass(status: string | null | undefined): string {
    return `status-${(status ?? 'unknown').toLowerCase()}`;
  }
}