// components/book-list/book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  categories: string[] = [];
  searchTerm = '';
  selectedCategory = '';
  allBooks: Book[] = [];

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.allBooks = books;
      },
      error: (error) => console.error('Error loading books:', error)
    });
  }

  loadCategories(): void {
    this.bookService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.bookService.searchBooks(this.searchTerm).subscribe({
        next: (books) => this.books = books,
        error: (error) => console.error('Error searching books:', error)
      });
    } else {
      this.loadBooks();
    }
  }

  onCategoryFilter(): void {
    if (this.selectedCategory) {
      this.bookService.getBooksByCategory(this.selectedCategory).subscribe({
        next: (books) => this.books = books,
        error: (error) => console.error('Error filtering books:', error)
      });
    } else {
      this.loadBooks();
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.loadBooks();
  }

  addToCart(book: Book): void {
    this.cartService.addToCart(book);
    alert('Book added to cart successfully!');
  }
}