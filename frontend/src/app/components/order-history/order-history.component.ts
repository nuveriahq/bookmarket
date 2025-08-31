// order-history.component.ts - FIXED VERSION
import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check authentication first
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.error = '';
    
    // FIXED: Use getUserOrders() instead of getAllOrders() for regular users
    this.orderService.getUserOrders().subscribe({
      next: (response: any) => {
        this.loading = false;
        
        if (response.success) {
          this.orders = response.orders || [];
        } else {
          this.error = response.message || 'Failed to load orders';
          this.orders = [];
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error loading orders:', error);
        
        if (error.status === 401) {
          this.error = 'Authentication required. Please log in again.';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.error = 'Access denied. Please check your permissions.';
        } else {
          this.error = 'Failed to load orders. Please try again.';
        }
        this.orders = [];
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'bg-warning text-dark';
      case 'SHIPPED': return 'bg-info text-white';
      case 'DELIVERED': return 'bg-success text-white';
      case 'CANCELLED': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  retry(): void {
    this.loadOrders();
  }
}