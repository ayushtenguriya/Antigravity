import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../core/services/auth.service';

@Component({
    selector: 'app-register',
    template: `
    <div class="auth-container">
      <div class="auth-card auth-card-wide">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p class="subtitle">Join the Job Portal today</p>
        </div>

        <div class="error-msg" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label>First Name</label>
              <input [(ngModel)]="form.firstName" name="firstName" required placeholder="John" />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input [(ngModel)]="form.lastName" name="lastName" required placeholder="Doe" />
            </div>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="form.email" name="email" required placeholder="john@example.com" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="form.password" name="password" required placeholder="Min. 6 characters" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <select [(ngModel)]="form.role" name="role" required>
              <option value="SEEKER">Job Seeker</option>
              <option value="EMPLOYER">Employer</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Phone</label>
              <input [(ngModel)]="form.phone" name="phone" placeholder="Optional" />
            </div>
            <div class="form-group">
              <label>Location</label>
              <input [(ngModel)]="form.location" name="location" placeholder="Optional" />
            </div>
          </div>
          <div class="form-group">
            <label>Profile Summary</label>
            <textarea [(ngModel)]="form.profileSummary" name="profileSummary" rows="3" placeholder="Tell us about yourself..."></textarea>
          </div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Creating...' : 'Create Account' }}
          </button>
        </form>

        <p class="auth-footer">
          Already have an account? <a routerLink="/login">Sign In</a>
        </p>
      </div>
    </div>
  `,
    styles: []
})
export class RegisterComponent {
    form: RegisterRequest = {
        firstName: '', lastName: '', email: '', password: '',
        role: 'SEEKER', phone: '', location: '', profileSummary: ''
    };
    error = '';
    loading = false;

    constructor(private auth: AuthService, private router: Router) { }

    onSubmit(): void {
        this.loading = true;
        this.error = '';
        this.auth.register(this.form).subscribe({
            next: () => {
                this.loading = false;
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.loading = false;
                this.error = err.error?.message || 'Registration failed. Please try again.';
            }
        });
    }
}
