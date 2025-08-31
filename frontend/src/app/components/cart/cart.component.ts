// components/cart/cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
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
    if (newQuantity > 0) {
      this.cartService.updateQuantity(bookId, newQuantity);
    } else if (newQuantity === 0) {
      this.removeFromCart(bookId);
    }
  }

  removeFromCart(bookId: number): void {
    this.cartService.removeFromCart(bookId);
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