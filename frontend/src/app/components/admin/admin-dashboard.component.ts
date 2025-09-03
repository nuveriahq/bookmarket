// admin-dashboard.component.ts - UPDATED VERSION
import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { Book } from '../../models/book.model';
import { Order } from '../../models/order.model';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  books: Book[] = [];
  orders: Order[] = [];
  users: User[] = [];
  editingBook: Book | null = null;
  newBook: Partial<Book> = {};
  
  // Loading and error states
  booksLoading = false;
  ordersLoading = false;
  usersLoading = false;
  booksError = '';
  ordersError = '';
  usersError = '';
  
  // Statistics
  stats = {
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockBooks: 0,
    totalCustomers: 0
  };
  
  // Filters
  orderStatusFilter = 'ALL';
  bookSearchTerm = '';
  userSearchTerm = '';
  
  // CSV Upload
  csvFile: File | null = null;
  csvUploading = false;
  csvUploadMessage = '';
  
  // Active tab
  activeTab = 'books';

  constructor(
    private bookService: BookService,
    private orderService: OrderService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadBooks();
    this.loadOrders();
    this.loadUsers();
  }

  loadBooks(): void {
    this.booksLoading = true;
    this.booksError = '';
    
    this.bookService.getAllBooks().subscribe({
      next: (books: Book[]) => {
        this.books = books;
        this.booksLoading = false;
        this.updateStats();
      },
      error: (error: any) => {
        console.error('Error loading books:', error);
        this.booksError = 'Failed to load books. Please try again.';
        this.booksLoading = false;
      }
    });
  }

  loadOrders(): void {
    this.ordersLoading = true;
    this.ordersError = '';
    
    // FIXED: Use proper error handling like order-history
    this.orderService.getAllOrders().subscribe({
      next: (response: any) => {
        this.ordersLoading = false;
        
        // Handle both direct array and wrapped response formats
        if (Array.isArray(response)) {
          this.orders = response;
        } else if (response.success) {
          this.orders = response.orders || [];
        } else {
          this.ordersError = response.message || 'Failed to load orders';
          this.orders = [];
        }
        this.updateStats();
      },
      error: (error) => {
        this.ordersLoading = false;
        console.error('Error loading orders:', error);
        
        if (error.status === 401) {
          this.ordersError = 'Authentication required. Please log in again.';
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          this.ordersError = 'Access denied. Admin privileges required.';
        } else {
          this.ordersError = 'Failed to load orders. Please try again.';
        }
        this.orders = [];
      }
    });
  }

  updateStats(): void {
    this.stats.totalBooks = this.books.length;
    this.stats.totalOrders = this.orders.length;
    this.stats.totalRevenue = this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    this.stats.lowStockBooks = this.books.filter(book => (book.stock || 0) < 10).length;
  }

  addBook(): void {
    if (this.newBook.title && this.newBook.author && this.newBook.price) {
      this.bookService.addBook(this.newBook as Book).subscribe({
        next: () => {
          this.loadBooks();
          this.newBook = {};
          // Show success message
          this.showSuccessMessage('Book added successfully!');
        },
        error: (error: any) => {
          console.error('Error adding book:', error);
          this.showErrorMessage('Failed to add book. Please try again.');
        }
      });
    } else {
      this.showErrorMessage('Please fill in all required fields.');
    }
  }

  editBook(book: Book): void {
    this.editingBook = { ...book };
  }

  updateBook(): void {
    if (this.editingBook && this.editingBook.id) {
      this.bookService.updateBook(this.editingBook.id, this.editingBook).subscribe({
        next: () => {
          this.loadBooks();
          this.editingBook = null;
          this.showSuccessMessage('Book updated successfully!');
        },
        error: (error: any) => {
          console.error('Error updating book:', error);
          this.showErrorMessage('Failed to update book. Please try again.');
        }
      });
    }
  }

  deleteBook(bookId: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.loadBooks();
          this.showSuccessMessage('Book deleted successfully!');
        },
        error: (error: any) => {
          console.error('Error deleting book:', error);
          this.showErrorMessage('Failed to delete book. Please try again.');
        }
      });
    }
  }

  updateOrderStatus(orderId: number, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.loadOrders();
        this.showSuccessMessage('Order status updated successfully!');
      },
      error: (error: any) => {
        console.error('Error updating order status:', error);
        this.showErrorMessage('Failed to update order status. Please try again.');
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

  getStockClass(stock: number): string {
    if (stock === 0) return 'text-danger fw-bold';
    if (stock < 10) return 'text-warning fw-bold';
    return 'text-success';
  }

  filteredOrders(): Order[] {
    if (this.orderStatusFilter === 'ALL') {
      return this.orders;
    }
    return this.orders.filter(order => order.status === this.orderStatusFilter);
  }

  filteredBooks(): Book[] {
    if (!this.bookSearchTerm) {
      return this.books;
    }
    const term = this.bookSearchTerm.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.category.toLowerCase().includes(term)
    );
  }

  filteredUsers(): User[] {
    if (!this.userSearchTerm) {
      return this.users;
    }
    const term = this.userSearchTerm.toLowerCase();
    return this.users.filter(user => 
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.customerId?.toLowerCase().includes(term)
    );
  }

  cancelEdit(): void {
    this.editingBook = null;
  }

  retryBooks(): void {
    this.loadBooks();
  }

  retryOrders(): void {
    this.loadOrders();
  }

  loadUsers(): void {
    this.usersLoading = true;
    this.usersError = '';
    
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.stats.totalCustomers = users.length;
        this.usersLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.usersError = 'Failed to load users';
        this.usersLoading = false;
      }
    });
  }

  retryUsers(): void {
    this.loadUsers();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  private showSuccessMessage(message: string): void {
    // You can implement a toast service here or use simple alert
    // For now, using console.log - replace with your preferred notification method
    console.log('SUCCESS:', message);
  }

  private showErrorMessage(message: string): void {
    // You can implement a toast service here or use simple alert
    // For now, using console.log - replace with your preferred notification method
    console.error('ERROR:', message);
  }

  viewOrderDetails(order: Order): void {
    // Implement order details modal or navigation
    console.log('View order details:', order);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      this.csvFile = file;
      this.csvUploadMessage = '';
    } else {
      this.csvUploadMessage = 'Please select a valid CSV file';
      this.csvFile = null;
    }
  }

  uploadCSV(): void {
    if (!this.csvFile) {
      this.csvUploadMessage = 'Please select a CSV file first';
      return;
    }

    this.csvUploading = true;
    this.csvUploadMessage = '';

    const formData = new FormData();
    formData.append('file', this.csvFile);

    this.bookService.uploadBooksCSV(formData).subscribe({
      next: (response) => {
        this.csvUploading = false;
        this.csvUploadMessage = `Successfully uploaded ${response.booksAdded} books from CSV`;
        this.csvFile = null;
        // Reset file input
        const fileInput = document.getElementById('csvFile') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        // Reload books
        this.loadBooks();
      },
      error: (error) => {
        this.csvUploading = false;
        this.csvUploadMessage = 'Failed to upload CSV: ' + (error.error?.message || error.message);
        console.error('CSV upload error:', error);
      }
    });
  }
}