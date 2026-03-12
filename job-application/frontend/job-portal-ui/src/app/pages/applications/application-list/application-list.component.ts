import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApplicationService, ApplicationResponse } from '../../../core/services/application.service';

@Component({
    selector: 'app-application-list',
    template: `
    <div class="page-container">
      <h1>Applications for Job #{{ jobId }}</h1>

      <div class="table-card glass-card" *ngIf="applications.length > 0">
        <table>
          <thead>
            <tr><th>ID</th><th>Seeker</th><th>Cover Letter</th><th>Status</th><th>Applied</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let app of applications">
              <td>#{{ app.id }}</td>
              <td>Seeker #{{ app.seekerId }}</td>
              <td class="truncate">{{ app.coverLetter | slice:0:60 }}...</td>
              <td><span class="status-chip" [ngClass]="'status-' + app.status?.toLowerCase()">{{ app.status }}</span></td>
              <td>{{ app.appliedAt | date:'shortDate' }}</td>
              <td class="action-btns">
                <button class="btn-sm btn-success" (click)="updateStatus(app.id, 'ACCEPTED')" *ngIf="app.status !== 'ACCEPTED'">Accept</button>
                <button class="btn-sm btn-danger" (click)="updateStatus(app.id, 'REJECTED')" *ngIf="app.status !== 'REJECTED'">Reject</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="applications.length === 0">
        <h3>No applications yet</h3>
        <p>No one has applied for this job yet.</p>
      </div>
    </div>
  `,
    styles: []
})
export class ApplicationListComponent implements OnInit {
    applications: ApplicationResponse[] = [];
    jobId = 0;

    constructor(private route: ActivatedRoute, private appService: ApplicationService) { }

    ngOnInit(): void {
        this.jobId = Number(this.route.snapshot.paramMap.get('jobId'));
        this.loadApplications();
    }

    loadApplications(): void {
        this.appService.getByJob(this.jobId).subscribe(data => this.applications = data);
    }

    updateStatus(id: number, status: string): void {
        this.appService.updateStatus(id, status).subscribe(() => this.loadApplications());
    }
}
