import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { JobService, JobResponse } from '../../core/services/job.service';
import { ApplicationService, ApplicationResponse } from '../../core/services/application.service';

@Component({
    selector: 'app-dashboard',
    template: `
    <div class="page-container">
      <h1>Dashboard</h1>
      <p class="subtitle">Welcome back, {{ userName }}! <span class="role-badge">{{ role }}</span></p>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card glass-card" *ngFor="let stat of stats">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Employer: My Jobs -->
      <div *ngIf="role === 'EMPLOYER'" class="section">
        <div class="section-header">
          <h2>My Job Listings</h2>
          <button class="btn-primary btn-sm" (click)="createJob()">+ Post New Job</button>
        </div>
        <div class="table-card glass-card" *ngIf="myJobs.length > 0">
          <table>
            <thead>
              <tr><th>Title</th><th>Company</th><th>Type</th><th>Status</th><th>Posted</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let job of myJobs">
                <td>{{ job.title }}</td>
                <td>{{ job.company }}</td>
                <td><span class="badge badge-sm">{{ job.jobType }}</span></td>
                <td><span class="status-chip" [ngClass]="'status-' + job.status?.toLowerCase()">{{ job.status }}</span></td>
                <td>{{ job.postedAt | date:'shortDate' }}</td>
                <td>
                  <button class="btn-icon" (click)="editJob(job.id)" title="Edit">✏️</button>
                  <button class="btn-icon" (click)="viewApplicants(job.id)" title="Applicants">👥</button>
                  <button class="btn-icon btn-danger" (click)="deleteJob(job.id)" title="Delete">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" *ngIf="myJobs.length === 0">
          <p>You haven't posted any jobs yet. <a (click)="createJob()">Post your first job →</a></p>
        </div>
      </div>

      <!-- Seeker: My Applications -->
      <div *ngIf="role === 'SEEKER'" class="section">
        <div class="section-header">
          <h2>My Applications</h2>
          <button class="btn-primary btn-sm" routerLink="/jobs">Browse Jobs</button>
        </div>
        <div class="table-card glass-card" *ngIf="myApplications.length > 0">
          <table>
            <thead>
              <tr><th>Job ID</th><th>Status</th><th>Applied</th><th>Last Updated</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let app of myApplications">
                <td><a [routerLink]="['/jobs', app.jobId]">#{{ app.jobId }}</a></td>
                <td><span class="status-chip" [ngClass]="'status-' + app.status?.toLowerCase()">{{ app.status }}</span></td>
                <td>{{ app.appliedAt | date:'shortDate' }}</td>
                <td>{{ app.updatedAt | date:'shortDate' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" *ngIf="myApplications.length === 0">
          <p>No applications yet. <a routerLink="/jobs">Start browsing →</a></p>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class DashboardComponent implements OnInit {
    role = '';
    userName = '';
    myJobs: JobResponse[] = [];
    myApplications: ApplicationResponse[] = [];
    stats: { icon: string; value: number; label: string }[] = [];

    constructor(
        private auth: AuthService,
        private jobService: JobService,
        private appService: ApplicationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const user = this.auth.getCurrentUser();
        this.role = user?.role || '';
        this.userName = user?.email?.split('@')[0] || '';

        if (this.role === 'EMPLOYER') {
            this.jobService.getByEmployer(user!.userId).subscribe(jobs => {
                this.myJobs = jobs;
                this.stats = [
                    { icon: '📋', value: jobs.length, label: 'Active Jobs' },
                    { icon: '✅', value: jobs.filter(j => j.status === 'ACTIVE').length, label: 'Open Positions' },
                    { icon: '📁', value: jobs.filter(j => j.status === 'CLOSED').length, label: 'Closed' }
                ];
            });
        } else if (this.role === 'SEEKER') {
            this.appService.getBySeeker(user!.userId).subscribe(apps => {
                this.myApplications = apps;
                this.stats = [
                    { icon: '📨', value: apps.length, label: 'Total Applied' },
                    { icon: '⏳', value: apps.filter(a => a.status === 'PENDING').length, label: 'Pending' },
                    { icon: '✅', value: apps.filter(a => a.status === 'ACCEPTED').length, label: 'Accepted' },
                    { icon: '❌', value: apps.filter(a => a.status === 'REJECTED').length, label: 'Rejected' }
                ];
            });
        }
    }

    createJob(): void { this.router.navigate(['/jobs/create']); }
    editJob(id: number): void { this.router.navigate(['/jobs', id, 'edit']); }
    viewApplicants(jobId: number): void { this.router.navigate(['/applications/job', jobId]); }

    deleteJob(id: number): void {
        if (confirm('Are you sure you want to delete this job?')) {
            this.jobService.delete(id).subscribe(() => {
                this.myJobs = this.myJobs.filter(j => j.id !== id);
            });
        }
    }
}
