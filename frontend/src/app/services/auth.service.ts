import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../environment/environment';

export interface User {
  id: number;
  email: string;
  leetCodeUsername?: string;
}

export interface AuthResponse {
  token: string;
  user: any; // flexible for casing issues
}

export interface RegisterRequest {
  email: string;
  password: string;
  leetCodeUsername?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(tap(response => this.setSession(response)));
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    const payload = {
      Email: data.email,
      Password: data.password,
      leetCodeUsername: data.leetCodeUsername ?? ''
    };

    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload)
      .pipe(tap(response => this.setSession(response)));
  }

  logout(): void {
    localStorage.clear();
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setSession(response: AuthResponse): void {
    const raw = response.user;

    const user: User = {
      id: raw.id,
      email: raw.email,
      leetCodeUsername:
        raw.leetCodeUsername ?? raw.LeetCodeUsername ?? raw.leetcodeUsername ?? ''
    };

    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadStoredUser(): void {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      const user: User = {
        id: parsed.id,
        email: parsed.email,
        leetCodeUsername:
          parsed.leetCodeUsername ?? parsed.LeetCodeUsername ?? parsed.leetcodeUsername ?? ''
      };
      this.currentUserSubject.next(user);
    }
  }
}
