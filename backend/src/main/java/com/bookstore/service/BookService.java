// BookService.java
package com.bookstore.service;

import com.bookstore.entity.Book;
import com.bookstore.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BookService {
    
    @Autowired
    private BookRepository bookRepository;
    
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }
    
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }
    
    public Book updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setPrice(bookDetails.getPrice());
        book.setDescription(bookDetails.getDescription());
        book.setCategory(bookDetails.getCategory());
        book.setStock(bookDetails.getStock());
        
        return bookRepository.save(book);
    }
    
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
    
    public List<Book> searchBooks(String searchTerm) {
        return bookRepository.searchBooks(searchTerm);
    }
    
    public List<Book> getBooksByCategory(String category) {
        return bookRepository.findByCategory(category);
    }
    
    public List<String> getAllCategories() {
        return bookRepository.findAllCategories();
    }
    
    public int uploadBooksFromCSV(MultipartFile file) throws Exception {
        int booksAdded = 0;
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = reader.readLine()) != null) {
                if (isFirstLine) {
                    isFirstLine = false;
                    continue; // Skip header row
                }
                
                String[] values = line.split(",");
                if (values.length >= 6) {
                    try {
                        Book book = new Book();
                        book.setTitle(values[0].trim());
                        book.setAuthor(values[1].trim());
                        book.setPrice(new BigDecimal(values[2].trim()));
                        book.setDescription(values[3].trim());
                        book.setCategory(values[4].trim());
                        book.setStock(Integer.parseInt(values[5].trim()));
                        
                        // Validate required fields
                        if (book.getTitle() != null && !book.getTitle().isEmpty() &&
                            book.getAuthor() != null && !book.getAuthor().isEmpty() &&
                            book.getPrice() != null && book.getPrice().compareTo(BigDecimal.ZERO) > 0 &&
                            book.getCategory() != null && !book.getCategory().isEmpty() &&
                            book.getStock() != null && book.getStock() >= 0) {
                            
                            bookRepository.save(book);
                            booksAdded++;
                        }
                    } catch (Exception e) {
                        // Skip invalid rows
                        System.err.println("Skipping invalid row: " + line + " - " + e.getMessage());
                    }
                }
            }
        }
        
        return booksAdded;
    }
    
    public Map<String, Object> getBooksPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> bookPage = bookRepository.findAll(pageable);
        
        Map<String, Object> response = new HashMap<>();
        response.put("books", bookPage.getContent());
        response.put("currentPage", bookPage.getNumber());
        response.put("totalItems", bookPage.getTotalElements());
        response.put("totalPages", bookPage.getTotalPages());
        response.put("pageSize", bookPage.getSize());
        response.put("hasNext", bookPage.hasNext());
        response.put("hasPrevious", bookPage.hasPrevious());
        
        return response;
    }
}