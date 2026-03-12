import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApplicationRequest {
    jobId: number; seekerId: number; coverLetter: string; resumeUrl?: string;
}
export interface ApplicationResponse {
    id: number; jobId: number; seekerId: number; coverLetter: string;
    resumeUrl: string; status: string; appliedAt: string; updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ApplicationService {
    private url = `${environment.apiUrl}/api/applications`;

    constructor(private http: HttpClient) { }

    apply(data: ApplicationRequest): Observable<ApplicationResponse> {
        return this.http.post<ApplicationResponse>(this.url, data);
    }

    getByJob(jobId: number): Observable<ApplicationResponse[]> {
        return this.http.get<ApplicationResponse[]>(`${this.url}/job/${jobId}`);
    }

    getBySeeker(seekerId: number): Observable<ApplicationResponse[]> {
        return this.http.get<ApplicationResponse[]>(`${this.url}/seeker/${seekerId}`);
    }

    getById(id: number): Observable<ApplicationResponse> {
        return this.http.get<ApplicationResponse>(`${this.url}/${id}`);
    }

    updateStatus(id: number, status: string): Observable<ApplicationResponse> {
        return this.http.put<ApplicationResponse>(`${this.url}/${id}/status`, { status });
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}
