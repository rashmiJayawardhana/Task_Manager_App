import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
import { Employee } from '../../../../shared/models/employee.model';
import { TaskDto } from '../../../../shared/models/task-dto.model'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  templateUrl: './post-task.component.html',
  styleUrls: ['./post-task.component.scss'],
})
export class PostTaskComponent implements OnInit {
  taskForm!: FormGroup;
  listOfEmployees: Employee[] = [];
  listOfPriorities: string[] = ['LOW', 'MEDIUM', 'HIGH'];
  isLoading = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      dueDate: [null, [Validators.required]],
      priority: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.adminService.getUsers().subscribe({
      next: (res) => {
        console.log('Users:', res);
        this.listOfEmployees = res;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.snackbar.open('Failed to load employees. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  postTask() {
    if (this.taskForm.valid) {
      this.isLoading = true;
      const task: TaskDto = { 
        ...this.taskForm.value,
        dueDate: this.taskForm.value.dueDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        taskStatus: 'INPROGRESS', // Match backend default
      };
      this.adminService.postTask(task).subscribe({
        next: (res) => {
          console.log('Task posted successfully:', res);
          this.snackbar.open('Task posted successfully!', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar'],
          });
          this.taskForm.reset();
          this.router.navigateByUrl('/admin/dashboard');
        },
        error: (err) => {
          console.error('Error posting task:', err);
          this.snackbar.open('Failed to post task. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }
}