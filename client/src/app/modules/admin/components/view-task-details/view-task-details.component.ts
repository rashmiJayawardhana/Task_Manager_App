import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './view-task-details.component.html',
  styleUrl: './view-task-details.component.scss'
})
export class ViewTaskDetailsComponent {

  taskId: number=this.activatedRoute.snapshot.params["id"];
  taskData: any;

  constructor(
    private service: AdminService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(){
    this.getTaskById();
  }

  getTaskById(){
    this.service.getTaskById(this.taskId).subscribe((res)=>{
      this.taskData = res;
    })
  }

}
