import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService, JobResponse } from '../../../core/services/job.service';

@Component({
    selector: 'app-job-list',
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Browse Jobs</h1>
        <div class="search-bar">
          <input type="text" [(ngModel)]="keyword" placeholder="Search jobs by title or company..."
                 (keyup.enter)="search()" />
          <button class="btn-primary btn-sm" (click)="search()">Search</button>
        </div>
      </div>

      <div class="jobs-grid" *ngIf="jobs.length > 0">
        <div class="job-card glass-card" *ngFor="let job of jobs" (click)="viewJob(job.id)">
          <div class="job-card-header">
            <div>
              <h3>{{ job.title }}</h3>
              <p class="company">{{ job.company }}</p>
            </div>
            <span class="badge" [ngClass]="'badge-' + job.jobType?.toLowerCase()">
              {{ job.jobType | titlecase }}
            </span>
          </div>
          <div class="job-card-body">
            <div class="job-meta">
              <span *ngIf="job.location">📍 {{ job.location }}</span>
              <span *ngIf="job.salaryMin || job.salaryMax">
                💰 {{ job.salaryMin | number }}  - {{ job.salaryMax | number }}
              </span>
              <span *ngIf="job.experienceLevel">🎯 {{ job.experienceLevel }}</span>
            </div>
            <p class="description">{{ job.description | slice:0:120 }}...</p>
          </div>
          <div class="job-card-footer">
            <span class="posted-date">Posted {{ job.postedAt | date:'mediumDate' }}</span>
            <button class="btn-outline btn-sm">View Details →</button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="jobs.length === 0 && !loading">
        <h3>No jobs found</h3>
        <p>Try a different search keyword or check back later.</p>
      </div>
    </div>
  `,
    styles: []
})
export class JobListComponent implements OnInit {
    jobs: JobResponse[] = [];
    keyword = '';
    loading = true;

    constructor(private jobService: JobService, private router: Router) { }

    ngOnInit(): void { this.loadJobs(); }

    loadJobs(): void {
        this.loading = true;
        this.jobService.getAll().subscribe({
            next: (data) => { this.jobs = data; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    search(): void {
        this.loading = true;
        this.jobService.getAll(this.keyword).subscribe({
            next: (data) => { this.jobs = data; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    viewJob(id: number): void {
        this.router.navigate(['/jobs', id]);
    }
}
