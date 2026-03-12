import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest {
    firstName: string; lastName: string; email: string; password: string;
    role: string; phone?: string; location?: string; profileSummary?: string;
}
export interface AuthResponse {
    token: string; userId: number; email: string; role: string;
}
export interface UserResponse {
    id: number; firstName: string; lastName: string; email: string;
    role: string; phone: string; location: string; profileSummary: string;
    createdAt: string; updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = environment.apiUrl;
    private currentUserSubject = new BehaviorSubject<AuthResponse | null>(this.getStoredUser());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) { }

    register(data: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, data)
            .pipe(tap(res => this.storeUser(res)));
    }

    login(data: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, data)
            .pipe(tap(res => this.storeUser(res)));
    }

    logout(): void {
        localStorage.removeItem('auth');
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        const user = this.getStoredUser();
        return user?.token ?? null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    getRole(): string | null {
        return this.getStoredUser()?.role ?? null;
    }

    getUserId(): number | null {
        return this.getStoredUser()?.userId ?? null;
    }

    getCurrentUser(): AuthResponse | null {
        return this.currentUserSubject.value;
    }

    getUserProfile(id: number): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.apiUrl}/api/users/${id}`);
    }

    getAllUsers(): Observable<UserResponse[]> {
        return this.http.get<UserResponse[]>(`${this.apiUrl}/api/users`);
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/api/users/${id}`);
    }

    private storeUser(res: AuthResponse): void {
        localStorage.setItem('auth', JSON.stringify(res));
        this.currentUserSubject.next(res);
    }

    private getStoredUser(): AuthResponse | null {
        const data = localStorage.getItem('auth');
        return data ? JSON.parse(data) : null;
    }
}
