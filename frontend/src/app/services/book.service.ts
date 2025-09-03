// services/book.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly API_URL = 'http://localhost:8080/api/books';

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.API_URL);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.API_URL}/${id}`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.API_URL, book);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.API_URL}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  searchBooks(searchTerm: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.API_URL}/search?q=${searchTerm}`);
  }

  getBooksByCategory(category: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.API_URL}/category/${category}`);
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/categories`);
  }

  uploadBooksCSV(file: FormData): Observable<{booksAdded: number}> {
    return this.http.post<{booksAdded: number}>(`${this.API_URL}/upload-csv`, file);
  }

  getBooksPaginated(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/paginated?page=${page}&size=${size}`);
  }
}