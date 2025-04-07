import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
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
  listOfTasks: TaskDto[] | undefined;

  constructor(
    private service: AdminService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.service.getAllTasks().subscribe({
      next: (res) => {
        this.listOfTasks = res.map(task => ({
          ...task,
          dueDate: new Date(task.dueDate),
          priority: task.priority ?? 'UNKNOWN', // Default to 'UNKNOWN' if null
          taskStatus: task.taskStatus ?? 'UNKNOWN', // Default to 'UNKNOWN' if null
        }));
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
        this.snackbar.open('Failed to load tasks. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
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