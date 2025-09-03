// services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUserProfile(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile/${username}`, {
      headers: this.getHeaders()
    });
  }

  updateUserProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile/${user.id}`, user, {
      headers: this.getHeaders()
    });
  }

  changePassword(passwordData: ChangePasswordRequest): Observable<any> {
    const username = localStorage.getItem('username');
    const requestData = {
      username: username,
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    };
    
    return this.http.post(`${this.apiUrl}/change-password`, requestData, {
      headers: this.getHeaders()
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/all`, {
      headers: this.getHeaders()
    });
  }
}
