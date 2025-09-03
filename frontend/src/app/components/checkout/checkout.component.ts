// components/checkout/checkout.component.ts - FIXED VERSION
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/order.model';
import { PaymentData } from '../payment/payment.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  checkoutForm: FormGroup;
  loading = false;
  showPayment = false;
  paymentData: PaymentData | null = null;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    // Check if user is authenticated with improved validation
    if (!this.authService.validateToken()) {
      console.log('User authentication validation failed, redirecting to login');
      this.authService.clearAuthData();
      this.router.navigate(['/login']);
      return;
    }

    // Debug: Log authentication info
    console.log('User authenticated:', this.authService.getCurrentUser());
    console.log('Token:', this.authService.getToken());

    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  getTotalAmount(): number {
    return this.cartService.getTotalAmount();
  }

  proceedToPayment(): void {
    if (this.checkoutForm.valid && this.cartItems.length > 0) {
      this.showPayment = true;
    } else {
      // Provide feedback for invalid form
      if (this.cartItems.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        this.router.navigate(['/cart']);
      } else {
        alert('Please fill in all required fields.');
        this.markFormGroupTouched();
      }
    }
  }

  onPaymentComplete(paymentData: PaymentData): void {
    this.paymentData = paymentData;
    this.placeOrder();
  }

  onPaymentCancel(): void {
    this.showPayment = false;
    this.paymentData = null;
  }

  placeOrder(): void {
    if (this.checkoutForm.valid && this.cartItems.length > 0 && this.paymentData) {
      this.loading = true;
      
      // FIXED: Create the proper structure matching backend expectations
      const orderRequest = {
        items: this.cartItems.map(item => ({
          bookId: item.book.id!,
          quantity: item.quantity
        })),
        shippingAddress: this.checkoutForm.value.address.trim(), // FIXED: Use shippingAddress
        paymentMethod: this.paymentData.paymentMethod,
        paymentDetails: this.paymentData
      };

      console.log('Sending order request:', orderRequest);

      this.orderService.createOrder(orderRequest).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.cartService.clearCart();
          
          if (response.success) {
            alert(`Order placed successfully! Order ID: ${response.orderId}`);
            this.router.navigate(['/orders']);
          } else {
            alert('Error: ' + response.message);
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error placing order:', error);
          
          // Enhanced error handling
          if (error.status === 401) {
            alert('Authentication expired. Please log in again.');
            this.authService.logout();
            this.router.navigate(['/login']);
          } else if (error.status === 400) {
            const errorMessage = error.error || 'Invalid order data. Please check your cart and try again.';
            alert('Error: ' + errorMessage);
          } else if (error.status === 403) {
            alert('Access denied. Please log in again.');
            this.authService.logout();
            this.router.navigate(['/login']);
          } else {
            alert('Error placing order. Please try again.');
          }
        }
      });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      control?.markAsTouched();
    });
  }
}