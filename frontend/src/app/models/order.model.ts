// models/order.model.ts
import { Book } from './book.model';

export interface Order {
  id?: number;
  user?: any;
  orderDate: Date;
  totalAmount: number;
  status: 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderItems: OrderItem[];
  address: string;
}

export interface OrderItem {
  id?: number;
  book: Book;
  quantity: number;
  price: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}