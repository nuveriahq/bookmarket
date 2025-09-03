// services/auth.service.ts - IMPROVED VERSION
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { CartService } from './cart.service';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  username: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  address: string;
  age: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private cartService: CartService) {
    // Load user data from localStorage on service initialization
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    
    if (token && username && role && this.isTokenValid(token)) {
      this.currentUserSubject.next({ username, role });
    } else {
      this.clearAuthData();
    }
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        tap(response => {
          if (response && response.token) {
            console.log('Login successful:', response);
            this.setAuthData(response);
            // Clear cart on login to ensure fresh cart for each user
            this.cartService.clearCart();
          }
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerRequest);
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('username', response.username);
    localStorage.setItem('role', response.role);
    
    this.currentUserSubject.next({
      username: response.username,
      role: response.role
    });
  }

  logout(): void {
    this.clearAuthData();
    this.currentUserSubject.next(null);
    // Clear cart when user logs out to prevent cart sharing between users
    this.cartService.clearCart();
  }

  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && this.isTokenValid(token);
  }

  validateToken(): boolean {
    const token = this.getToken();
    const username = this.getUsername();
    
    if (!token || !username) {
      console.log('Missing token or username');
      return false;
    }

    if (!this.isTokenValid(token)) {
      console.log('Token is invalid or expired');
      this.clearAuthData();
      return false;
    }

    return true;
  }

  private isTokenValid(token: string): boolean {
    if (!token) return false;
    
    try {
      // Basic JWT structure validation
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Decode payload to check expiration
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        console.log('Token has expired');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getRole() === 'USER';
  }
}