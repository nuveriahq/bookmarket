// services/order.service.ts - FIXED VERSION
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { AuthService } from './auth.service';

export interface OrderRequest {
  items: OrderItemRequest[];
  shippingAddress: string;
}

export interface OrderItemRequest {
  bookId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  createOrder(orderRequest: OrderRequest): Observable<Order> {
    console.log('OrderService: Sending request:', orderRequest);
    console.log('OrderService: Token:', this.authService.getToken());
    
    return this.http.post<Order>(this.apiUrl, orderRequest, {
      headers: this.getAuthHeaders()
    });
  }

  getUserOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllOrders(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin`, {
      headers: this.getAuthHeaders()
    });
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/status`, 
      { status }, 
      { headers: this.getAuthHeaders() }
    );
  }
}