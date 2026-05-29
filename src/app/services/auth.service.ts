import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../constants/api.constants';
import { LoginRequest, LoginResponse } from '../models/auth.model';

const USER_STORAGE_KEY = 'ticketToolUser';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly url = `${API_BASE_URL}`;  // old -- Auth



  readonly currentUser = signal<LoginResponse | null>(this.readUserFromStorage());

  login(request: LoginRequest) {
    debugger;
    return this.http.post<LoginResponse>(`${this.url}/login`, request);
  }

  saveLogin(user: LoginResponse): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout(): void {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.currentUser.set(null);
    this.router.navigateByUrl('/login');
  }

  private readUserFromStorage(): LoginResponse | null {
    const value = localStorage.getItem(USER_STORAGE_KEY);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as LoginResponse;
  }
}
