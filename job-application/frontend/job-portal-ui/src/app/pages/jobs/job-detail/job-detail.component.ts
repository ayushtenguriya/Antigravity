import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService, JobResponse } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-job-detail',
    template: `
    <div class="page-container" *ngIf="job">
      <button class="btn-back" (click)="goBack()">← Back to Jobs</button>

      <div class="detail-card glass-card">
        <div class="detail-header">
          <div>
            <h1>{{ job.title }}</h1>
            <p class="company-name">{{ job.company }}</p>
          </div>
          <span class="badge badge-lg" [ngClass]="'badge-' + job.jobType?.toLowerCase()">
            {{ job.jobType | titlecase }}
          </span>
        </div>

        <div class="detail-meta">
          <div class="meta-item" *ngIf="job.location"><span class="meta-icon">📍</span> {{ job.location }}</div>
          <div class="meta-item" *ngIf="job.salaryMin"><span class="meta-icon">💰</span> {{ job.salaryMin | number }} - {{ job.salaryMax | number }}</div>
          <div class="meta-item" *ngIf="job.experienceLevel"><span class="meta-icon">🎯</span> {{ job.experienceLevel }}</div>
          <div class="meta-item"><span class="meta-icon">📅</span> Posted {{ job.postedAt | date:'mediumDate' }}</div>
        </div>

        <div class="detail-section">
          <h2>Description</h2>
          <p>{{ job.description }}</p>
        </div>

        <div class="detail-section" *ngIf="job.requirements">
          <h2>Requirements</h2>
          <p>{{ job.requirements }}</p>
        </div>

        <div class="detail-section" *ngIf="job.benefits">
          <h2>Benefits</h2>
          <p>{{ job.benefits }}</p>
        </div>

        <!-- Apply Section (for Seekers) -->
        <div class="apply-section" *ngIf="canApply">
          <h2>Apply for this Position</h2>
          <div class="success-msg" *ngIf="applied">Application submitted successfully! 🎉</div>
          <div class="error-msg" *ngIf="applyError">{{ applyError }}</div>
          <form *ngIf="!applied" (ngSubmit)="apply()">
            <div class="form-group">
              <label>Cover Letter</label>
              <textarea [(ngModel)]="coverLetter" name="coverLetter" rows="5"
                        placeholder="Tell the employer why you're a great fit..."></textarea>
            </div>
            <button type="submit" class="btn-primary" [disabled]="applying">
              {{ applying ? 'Submitting...' : 'Submit Application' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
    styles: []
})
export class JobDetailComponent implements OnInit {
    job: JobResponse | null = null;
    coverLetter = '';
    applied = false;
    applying = false;
    applyError = '';
    canApply = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private jobService: JobService,
        private appService: ApplicationService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.canApply = this.authService.getRole() === 'SEEKER';
        this.jobService.getById(id).subscribe({
            next: (data) => this.job = data,
            error: () => this.router.navigate(['/jobs'])
        });
    }

    apply(): void {
        if (!this.job) return;
        this.applying = true;
        this.applyError = '';
        this.appService.apply({
            jobId: this.job.id,
            seekerId: this.authService.getUserId()!,
            coverLetter: this.coverLetter
        }).subscribe({
            next: () => { this.applied = true; this.applying = false; },
            error: (err) => {
                this.applyError = err.error?.message || 'Failed to submit application.';
                this.applying = false;
            }
        });
    }

    goBack(): void { this.router.navigate(['/jobs']); }
}
