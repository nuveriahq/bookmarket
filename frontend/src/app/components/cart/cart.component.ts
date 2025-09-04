// components/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { CartItem } from '../../models/order.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount = 0;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  updateQuantity(bookId: number, newQuantity: number): void {
    const success = this.cartService.updateQuantity(bookId, newQuantity);
    if (!success && newQuantity > 0) {
      this.toastService.showError('Cannot add more items than available in stock!');
    } else if (success) {
      this.toastService.showSuccess('Cart updated successfully!');
    }
  }

  removeFromCart(bookId: number): void {
    this.cartService.removeFromCart(bookId);
    this.toastService.showInfo('Item removed from cart');
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((total, item) => {
      return total + (item.book.price * item.quantity);
    }, 0);
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/books']);
  }
}