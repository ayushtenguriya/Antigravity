import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../core/services/auth.service';

@Component({
    selector: 'app-login',
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="12" fill="url(#grad)"/>
              <path d="M12 28V16l8-6 8 6v12H22v-6h-4v6H12z" fill="white"/>
              <defs><linearGradient id="grad" x1="0" y1="0" x2="40" y2="40">
                <stop stop-color="#7c3aed"/><stop offset="1" stop-color="#4f46e5"/>
              </linearGradient></defs>
            </svg>
          </div>
          <h1>Welcome Back</h1>
          <p class="subtitle">Sign in to your Job Portal account</p>
        </div>

        <div class="error-msg" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input id="email" type="email" [(ngModel)]="form.email" name="email" required placeholder="Enter your email" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" [(ngModel)]="form.password" name="password" required placeholder="Enter your password" />
          </div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="auth-footer">
          Don't have an account? <a routerLink="/register">Create one</a>
        </p>
      </div>
    </div>
  `,
    styles: []
})
export class LoginComponent {
    form: LoginRequest = { email: '', password: '' };
    error = '';
    loading = false;

    constructor(private auth: AuthService, private router: Router) { }

    onSubmit(): void {
        this.loading = true;
        this.error = '';
        this.auth.login(this.form).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.message || 'Invalid credentials. Please try again.';
            }
        });
    }
}
