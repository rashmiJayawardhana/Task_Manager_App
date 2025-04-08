import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-view-task-details',
  standalone: true,
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
  styleUrls: ['./view-task-details.component.scss'],
})
export class ViewTaskDetailsComponent implements OnInit {
  taskId!: number;
  taskData: any;
  comments: any[] = [];
  commentForm!: FormGroup;
  isLoading: boolean = false;
  error: string | null = null;
  private descriptionHeightThreshold = 100;
  isDescriptionLong: boolean = false; // Declare the property
  showFullDescription: boolean = false; // Declare the property

  constructor(
    private service: AdminService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {
    this.taskId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    this.commentForm = this.fb.group({
      content: [null, Validators.required],
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
        this.checkDescriptionLength(); // Call after taskData is set
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load task details';
        this.snackbar.open(this.error ?? 'An error occurred', 'Close', { duration: 5000 });
        this.isLoading = false;
      },
    });
  }

  getComments() {
    this.service.getCommentsByTaskId(this.taskId).subscribe({
      next: (res) => {
        this.comments = res;
      },
      error: (err) => {
        this.snackbar.open('Failed to load comments', 'Close', { duration: 5000 });
      },
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
          this.getComments();
        } else {
          this.snackbar.open('Failed to post comment', 'Close', { duration: 5000 });
        }
      },
      error: (err) => {
        this.snackbar.open(err.error?.message || 'Something went wrong', 'Close', { duration: 5000 });
      },
    });
  }

  checkDescriptionLength() {
    if (this.taskData?.description) {
      const tempElement = document.createElement('p');
      tempElement.className = 'task-description';
      tempElement.style.visibility = 'hidden';
      tempElement.style.position = 'absolute';
      tempElement.innerText = this.taskData.description;
      document.body.appendChild(tempElement);
      this.isDescriptionLong = tempElement.scrollHeight > this.descriptionHeightThreshold;
      document.body.removeChild(tempElement);
    }
  }

  toggleShowDescription() {
    this.showFullDescription = !this.showFullDescription;
  }
}