import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { JobListComponent } from './pages/jobs/job-list/job-list.component';
import { JobDetailComponent } from './pages/jobs/job-detail/job-detail.component';
import { JobFormComponent } from './pages/jobs/job-form/job-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ApplicationListComponent } from './pages/applications/application-list/application-list.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/jobs', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/create', component: JobFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EMPLOYER'] } },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'jobs/:id/edit', component: JobFormComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EMPLOYER'] } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'applications/job/:jobId', component: ApplicationListComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['EMPLOYER', 'ADMIN'] } },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] } },
  { path: '**', redirectTo: '/jobs' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
