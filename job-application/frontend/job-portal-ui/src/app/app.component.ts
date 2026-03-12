import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar">
      <div class="nav-brand" routerLink="/jobs">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="12" fill="url(#navgrad)"/>
          <path d="M12 28V16l8-6 8 6v12H22v-6h-4v6H12z" fill="white"/>
          <defs><linearGradient id="navgrad" x1="0" y1="0" x2="40" y2="40">
            <stop stop-color="#7c3aed"/><stop offset="1" stop-color="#4f46e5"/>
          </linearGradient></defs>
        </svg>
        <span>JobPortal</span>
      </div>

      <div class="nav-links">
        <a routerLink="/jobs" routerLinkActive="active">Jobs</a>
        <a routerLink="/dashboard" routerLinkActive="active" *ngIf="isLoggedIn">Dashboard</a>
        <a routerLink="/admin/users" routerLinkActive="active" *ngIf="role === 'ADMIN'">Admin</a>
      </div>

      <div class="nav-actions">
        <ng-container *ngIf="!isLoggedIn">
          <a routerLink="/login" class="btn-outline btn-sm">Sign In</a>
          <a routerLink="/register" class="btn-primary btn-sm">Register</a>
        </ng-container>
        <ng-container *ngIf="isLoggedIn">
          <span class="user-badge">
            <span class="role-badge" [ngClass]="'role-' + role?.toLowerCase()">{{ role }}</span>
            {{ email }}
          </span>
          <button class="btn-outline btn-sm" (click)="logout()">Sign Out</button>
        </ng-container>
      </div>
    </nav>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: []
})
export class AppComponent {
  isLoggedIn = false;
  email = '';
  role = '';

  constructor(private auth: AuthService, private router: Router) {
    this.auth.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.email = user?.email || '';
      this.role = user?.role || '';
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
