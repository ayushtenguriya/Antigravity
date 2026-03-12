import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService, JobRequest, JobResponse } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-job-form',
    template: `
    <div class="page-container">
      <button class="btn-back" (click)="goBack()">← Back</button>
      <div class="form-card glass-card">
        <h1>{{ isEdit ? 'Edit Job' : 'Post a New Job' }}</h1>
        <div class="error-msg" *ngIf="error">{{ error }}</div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label>Job Title</label>
            <input [(ngModel)]="form.title" name="title" required placeholder="e.g. Senior Angular Developer" />
          </div>
          <div class="form-group">
            <label>Company</label>
            <input [(ngModel)]="form.company" name="company" required placeholder="Company name" />
          </div>
          <div class="form-group">
            <label>Description</label>
            <textarea [(ngModel)]="form.description" name="description" required rows="5" placeholder="Job description..."></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Location</label>
              <input [(ngModel)]="form.location" name="location" placeholder="e.g. Remote, New York" />
            </div>
            <div class="form-group">
              <label>Experience Level</label>
              <input [(ngModel)]="form.experienceLevel" name="experienceLevel" placeholder="e.g. Senior, Mid-level" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Min Salary</label>
              <input type="number" [(ngModel)]="form.salaryMin" name="salaryMin" placeholder="50000" />
            </div>
            <div class="form-group">
              <label>Max Salary</label>
              <input type="number" [(ngModel)]="form.salaryMax" name="salaryMax" placeholder="120000" />
            </div>
          </div>
          <div class="form-group">
            <label>Job Type</label>
            <select [(ngModel)]="form.jobType" name="jobType" required>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="FREELANCE">Freelance</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>
          <div class="form-group">
            <label>Requirements</label>
            <textarea [(ngModel)]="form.requirements" name="requirements" rows="3" placeholder="Required skills..."></textarea>
          </div>
          <div class="form-group">
            <label>Benefits</label>
            <textarea [(ngModel)]="form.benefits" name="benefits" rows="3" placeholder="Benefits offered..."></textarea>
          </div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Saving...' : (isEdit ? 'Update Job' : 'Post Job') }}
          </button>
        </form>
      </div>
    </div>
  `,
    styles: []
})
export class JobFormComponent implements OnInit {
    form: JobRequest = {
        title: '', description: '', company: '', location: '',
        salaryMin: 0, salaryMax: 0, jobType: 'FULL_TIME', status: 'ACTIVE',
        requirements: '', benefits: '', experienceLevel: '', employerId: 0
    };
    isEdit = false;
    jobId = 0;
    error = '';
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private jobService: JobService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.form.employerId = this.authService.getUserId()!;
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.jobId = +id;
            this.jobService.getById(this.jobId).subscribe({
                next: (job) => {
                    this.form = { ...job };
                }
            });
        }
    }

    onSubmit(): void {
        this.loading = true;
        const obs = this.isEdit
            ? this.jobService.update(this.jobId, this.form)
            : this.jobService.create(this.form);
        obs.subscribe({
            next: () => { this.loading = false; this.router.navigate(['/dashboard']); },
            error: (err) => { this.loading = false; this.error = err.error?.message || 'Failed to save job.'; }
        });
    }

    goBack(): void { this.router.navigate(['/dashboard']); }
}
