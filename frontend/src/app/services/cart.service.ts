// services/cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/order.model';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(book: Book, quantity: number = 1): boolean {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.book.id === book.id);
    
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = currentQuantity + quantity;
    
    // Check if adding this quantity would exceed stock
    if (newTotalQuantity > book.stock) {
      return false; // Cannot add more than available stock
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ book, quantity });
    }

    this.cartItems.next([...currentItems]);
    this.saveCartToStorage();
    return true;
  }

  removeFromCart(bookId: number): void {
    const currentItems = this.cartItems.value.filter(item => item.book.id !== bookId);
    this.cartItems.next(currentItems);
    this.saveCartToStorage();
  }

  updateQuantity(bookId: number, quantity: number): boolean {
    const currentItems = this.cartItems.value;
    const item = currentItems.find(item => item.book.id === bookId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(bookId);
        return true;
      } else if (quantity > item.book.stock) {
        return false; // Cannot set quantity higher than available stock
      } else {
        item.quantity = quantity;
        this.cartItems.next([...currentItems]);
        this.saveCartToStorage();
        return true;
      }
    }
    return false;
  }

  clearCart(): void {
    this.cartItems.next([]);
    localStorage.removeItem('cart');
  }

  getTotalAmount(): number {
    return this.cartItems.value.reduce((total, item) => 
      total + (item.book.price * item.quantity), 0);
  }

  getItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  private loadCartFromStorage(): void {
    const saved = localStorage.getItem('cart');
    if (saved) {
      this.cartItems.next(JSON.parse(saved));
    }
  }
}