import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employee.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-task-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './view-task-details.component.html',
  styleUrl: './view-task-details.component.scss'
})
export class ViewTaskDetailsComponent {
  taskId!: number; // Use definite assignment assertion or initialize later
  taskData: any;
  comments: any[] = [];
  commentForm!: FormGroup;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private service: EmployeeService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {
    // Initialize taskId in the constructor
    this.taskId = this.activatedRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.commentForm = this.fb.group({
      content: [null, Validators.required]
    });
    this.getTaskById();
    this.getComments();
  }

  getTaskById() {
    this.isLoading = true;
    this.error = null;
    this.service.getTaskById(this.taskId).subscribe({
      next: (res) => {
        this.taskData = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load task details';
        this.snackbar.open(this.error ?? 'An error occurred', 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }

  getComments() {
    this.service.getCommentsByTaskId(this.taskId).subscribe({
      next: (res) => {
        this.comments = res;
      },
      error: (err) => {
        this.snackbar.open('Failed to load comments', 'Close', { duration: 5000 });
      }
    });
  }

  publishComment() {
    if (this.commentForm.invalid) {
      return;
    }

    const content = this.commentForm.get('content')?.value;
    this.service.createComment(this.taskId, content).subscribe({
      next: (res) => {
        if (res.id) {
          this.snackbar.open('Comment posted successfully', 'Close', { duration: 5000 });
          this.commentForm.reset();
          this.getComments(); // Refresh comments after posting
        } else {
          this.snackbar.open('Failed to post comment', 'Close', { duration: 5000 });
        }
      },
      error: (err) => {
        this.snackbar.open(err.error?.message || 'Something went wrong', 'Close', { duration: 5000 });
      }
    });
  }
}
