import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface NotificationResponse {
    id: number; userId: number; message: string; type: string;
    read: boolean; referenceId: number; createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private url = `${environment.apiUrl}/api/notifications`;

    constructor(private http: HttpClient) { }

    getByUser(userId: number): Observable<NotificationResponse[]> {
        return this.http.get<NotificationResponse[]>(`${this.url}/user/${userId}`);
    }

    markAsRead(id: number): Observable<NotificationResponse> {
        return this.http.put<NotificationResponse>(`${this.url}/${id}/read`, {});
    }

    getUnreadCount(userId: number): Observable<{ count: number }> {
        return this.http.get<{ count: number }>(`${this.url}/user/${userId}/unread-count`);
    }
}
