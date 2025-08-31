// models/book.model.ts
export interface Book {
  id?: number;
  title: string;
  author: string;
  price: number;
  description: string;
  category: string;
  stock: number;
}