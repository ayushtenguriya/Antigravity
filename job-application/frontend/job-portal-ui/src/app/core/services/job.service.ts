import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface JobRequest {
    title: string; description: string; company: string; location: string;
    salaryMin: number; salaryMax: number; jobType: string; status: string;
    requirements: string; benefits: string; experienceLevel: string; employerId: number;
}
export interface JobResponse {
    id: number; title: string; description: string; company: string; location: string;
    salaryMin: number; salaryMax: number; jobType: string; status: string;
    requirements: string; benefits: string; experienceLevel: string;
    employerId: number; postedAt: string; updatedAt: string; expiresAt: string;
}

@Injectable({ providedIn: 'root' })
export class JobService {
    private url = `${environment.apiUrl}/api/jobs`;

    constructor(private http: HttpClient) { }

    getAll(keyword?: string): Observable<JobResponse[]> {
        let params = new HttpParams();
        if (keyword) params = params.set('keyword', keyword);
        return this.http.get<JobResponse[]>(this.url, { params });
    }

    getById(id: number): Observable<JobResponse> {
        return this.http.get<JobResponse>(`${this.url}/${id}`);
    }

    getByEmployer(employerId: number): Observable<JobResponse[]> {
        return this.http.get<JobResponse[]>(`${this.url}/employer/${employerId}`);
    }

    create(job: JobRequest): Observable<JobResponse> {
        return this.http.post<JobResponse>(this.url, job);
    }

    update(id: number, job: JobRequest): Observable<JobResponse> {
        return this.http.put<JobResponse>(`${this.url}/${id}`, job);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
