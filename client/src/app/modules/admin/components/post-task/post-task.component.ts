import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { CreateTaskDto } from '../../../../shared/models/task-dto.model'; 
import { Router, RouterLink } from '@angular/router';
import { format } from 'date-fns';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

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
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './post-task.component.html',
  styleUrls: ['./post-task.component.scss'],
})
export class PostTaskComponent implements OnInit, OnDestroy {
  taskForm!: FormGroup;
  listOfEmployees: Employee[] = [];
  listOfPriorities: string[] = ['LOW', 'MEDIUM', 'HIGH'];
  isLoading = false;
  private titleSubscription!: Subscription;
  private descriptionSubscription!: Subscription;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      employeeId: [null, [Validators.required]],
      title: [null, [Validators.required, Validators.maxLength(50)]], 
      description: [null, [Validators.required, Validators.maxLength(200)]], 
      dueDate: [null, [Validators.required]],
      priority: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.getUsers();
    this.setupValidationAlerts();
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks
    if (this.titleSubscription) {
      this.titleSubscription.unsubscribe();
    }
    if (this.descriptionSubscription) {
      this.descriptionSubscription.unsubscribe();
    }
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

  setupValidationAlerts() {
    // Monitor title field for maxlength violation
    this.titleSubscription = this.taskForm.get('title')!.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      const titleControl = this.taskForm.get('title');
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

    // Monitor description field for maxlength violation
    this.descriptionSubscription = this.taskForm.get('description')!.valueChanges.pipe(
      debounceTime(300)
    ).subscribe(value => {
      const descriptionControl = this.taskForm.get('description');
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

  postTask() {
    if (this.taskForm.valid) {
      this.isLoading = true;
      const dueDate = this.taskForm.value.dueDate;
      const formattedDueDate = format(dueDate, "yyyy-MM-dd HH:mm:ss");
      const task: CreateTaskDto = {
        employeeId: this.taskForm.value.employeeId,
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        dueDate: formattedDueDate,
        priority: this.taskForm.value.priority,
        taskStatus: 'INPROGRESS',
      };
      console.log('Task payload:', task);
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
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }
}