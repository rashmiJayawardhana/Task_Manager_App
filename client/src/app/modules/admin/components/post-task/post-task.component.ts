import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-post-task',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './post-task.component.html',
  styleUrls: ['./post-task.component.scss'],
})
export class PostTaskComponent implements OnInit {
  users: any[] = []; // To store the users

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.adminService.getUsers().subscribe({
      next: (res) => {
        console.log('Users:', res);
        this.users = res; // Store the users
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      },
    });
  }
}