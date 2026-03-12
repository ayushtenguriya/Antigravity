import { Component, OnInit } from '@angular/core';
import { AuthService, UserResponse } from '../../../core/services/auth.service';

@Component({
    selector: 'app-admin-users',
    template: `
    <div class="page-container">
      <h1>User Management</h1>
      <p class="subtitle">Admin panel — manage all registered users</p>

      <div class="table-card glass-card" *ngIf="users.length > 0">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>#{{ user.id }}</td>
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td><span class="role-badge" [ngClass]="'role-' + user.role?.toLowerCase()">{{ user.role }}</span></td>
              <td>{{ user.createdAt | date:'shortDate' }}</td>
              <td>
                <button class="btn-sm btn-danger" (click)="deleteUser(user.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
    styles: []
})
export class AdminUsersComponent implements OnInit {
    users: UserResponse[] = [];

    constructor(private auth: AuthService) { }

    ngOnInit(): void {
        this.auth.getAllUsers().subscribe(data => this.users = data);
    }

    deleteUser(id: number): void {
        if (confirm('Are you sure you want to delete this user?')) {
            this.auth.deleteUser(id).subscribe(() => {
                this.users = this.users.filter(u => u.id !== id);
            });
        }
    }
}
