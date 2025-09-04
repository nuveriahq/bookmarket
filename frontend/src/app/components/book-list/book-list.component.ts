// components/book-list/book-list.component.ts
import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';
import { Router } from '@angular/router';
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
  
  // Pagination
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  hasNext = false;
  hasPrevious = false;
  loading = false;
  
  // Math reference for template
  Math = Math;

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private authService: AuthService,
    private toastService: ToastService,
    private modalService: ModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBooksPaginated();
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

  loadBooksPaginated(): void {
    this.loading = true;
    this.bookService.getBooksPaginated(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.books = response.books;
        this.currentPage = response.currentPage;
        this.totalItems = response.totalItems;
        this.totalPages = response.totalPages;
        this.hasNext = response.hasNext;
        this.hasPrevious = response.hasPrevious;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.loading = false;
      }
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
      this.currentPage = 0;
      this.loadBooksPaginated();
    }
  }

  onCategoryFilter(): void {
    if (this.selectedCategory) {
      this.bookService.getBooksByCategory(this.selectedCategory).subscribe({
        next: (books) => this.books = books,
        error: (error) => console.error('Error filtering books:', error)
      });
    } else {
      this.currentPage = 0;
      this.loadBooksPaginated();
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.currentPage = 0;
    this.loadBooksPaginated();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadBooksPaginated();
  }

  nextPage(): void {
    if (this.hasNext) {
      this.currentPage++;
      this.loadBooksPaginated();
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.currentPage--;
      this.loadBooksPaginated();
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadBooksPaginated();
  }

  // addToCart(book: Book): void {
  //   const success = this.cartService.addToCart(book);
  //   if (success) {
  //     alert('Book added to cart successfully!');
  //   } else {
  //     alert('Cannot add more items than available in stock!');
  //   }
  // }

  // ... existing code ...

  addToCart(book: Book): void {
    // Check if user is logged in first
    if (!this.authService.isLoggedIn()) {
      this.modalService.showConfirm(
        'Login Required',
        'Please login to add items to your cart. Would you like to login now?'
      ).then((confirmed) => {
        if (confirmed) {
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    const success = this.cartService.addToCart(book);
    if (success) {
      this.toastService.showSuccess('Book added to cart successfully!');
    } else {
      this.toastService.showError('Cannot add more items than available in stock!');
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}