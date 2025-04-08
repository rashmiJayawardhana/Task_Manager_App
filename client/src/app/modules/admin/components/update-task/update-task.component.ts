import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
import { Employee } from '../../../../shared/models/employee.model';
import { CreateTaskDto } from '../../../../shared/models/task-dto.model';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { format } from 'date-fns';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-update-task',
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
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss'],
})
export class UpdateTaskComponent implements OnInit, OnDestroy {
  updateTaskForm: FormGroup;
  listOfEmployees: Employee[] = [];
  listOfPriorities: string[] = ['LOW', 'MEDIUM', 'HIGH'];
  listOfTaskStatuses: string[] = ['PENDING', 'INPROGRESS', 'COMPLETED', 'DEFERRED', 'CANCELLED'];
  taskId: number;
  isUpdating = false;
  private titleSubscription!: Subscription;
  private descriptionSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private snackbar: MatSnackBar
  ) {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    this.updateTaskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.maxLength(200)]],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      employeeId: ['', Validators.required],
      taskStatus: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadEmployees();
    this.loadTask();
    this.setupValidationAlerts();
  }

  ngOnDestroy() {
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
    if (this.descriptionSubscription) {
      this.descriptionSubscription.unsubscribe();
    }
  }

  loadEmployees() {
    this.adminService.getUsers().subscribe({
      next: (employees) => {
        this.listOfEmployees = employees;
      },
      error: (err) => {
        console.error('Error fetching employees:', err);
        this.snackbar.open('Failed to load employees. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  loadTask() {
    this.adminService.getTaskById(this.taskId).subscribe({
      next: (task) => {
        this.updateTaskForm.patchValue({
          title: task.title,
          description: task.description,
          dueDate: new Date(task.dueDate),
          priority: task.priority,
          taskStatus: task.taskStatus,
          employeeId: task.employeeId,
        });
      },
      error: (err) => {
        console.error('Error fetching task:', err);
        this.snackbar.open('Failed to load task. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  setupValidationAlerts() {
    this.titleSubscription = this.updateTaskForm.get('title')!.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      const titleControl = this.updateTaskForm.get('title');
      if (titleControl?.hasError('maxlength') && titleControl.touched) {
        this.snackbar.open(
          `Title exceeds maximum length of 30 characters (current: ${value?.length || 0})`,
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        );
      }
    });

    this.descriptionSubscription = this.updateTaskForm.get('description')!.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      const descriptionControl = this.updateTaskForm.get('description');
      if (descriptionControl?.hasError('maxlength') && descriptionControl.touched) {
        this.snackbar.open(
          `Description exceeds maximum length of 200 characters (current: ${value?.length || 0})`,
          'Close',
          {
            duration: 5000,
            panelClass: ['error-snackbar'],
          }
        );
      }
    });
  }

  updateTask() {
    if (this.updateTaskForm.valid) {
      this.isUpdating = true;
      const dueDate = this.updateTaskForm.value.dueDate;
      const formattedDueDate = format(dueDate, "yyyy-MM-dd HH:mm:ss");
      const taskDto: CreateTaskDto = { 
        title: this.updateTaskForm.value.title,
        description: this.updateTaskForm.value.description,
        dueDate: formattedDueDate,
        priority: this.updateTaskForm.value.priority,
        taskStatus: this.updateTaskForm.value.taskStatus,
        employeeId: this.updateTaskForm.value.employeeId,
      };
      console.log('Task payload:', taskDto); 
      this.adminService.updateTask(this.taskId, taskDto).subscribe({
        next: () => {
          this.snackbar.open('Task updated successfully', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar'],
          });
          this.isUpdating = false;
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err) => {
          console.error('Error updating task:', err);
          this.snackbar.open('Failed to update task. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
          this.isUpdating = false;
        },
      });
    } else {
      this.snackbar.open('Please correct the errors in the form before submitting.', 'Close', {
        duration: 5000,
        panelClass: ['error-snackbar'],
      });
    }
  }
}