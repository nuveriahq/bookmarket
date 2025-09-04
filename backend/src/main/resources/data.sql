-- data.sql (placed in src/main/resources/)
-- Initial data for testing

-- Insert admin user (password: admin123)
-- Password is BCrypt encoded version of "admin123"
-- INSERT INTO users (username, email, password, address, customer_id, role, age, created_date) 
-- VALUES ('admin', 'admin@bookstore.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 
--         'Admin Address', 'ADMIN001', 'ADMIN', 30, CURRENT_TIMESTAMP);

-- Insert sample books
-- Insert sample books
INSERT INTO books (title, author, price, description, category, stock) VALUES
-- Fiction Classics
('The Great Gatsby', 'F. Scott Fitzgerald', 12.99, 'A classic American novel about the Jazz Age', 'Fiction', 50),
('To Kill a Mockingbird', 'Harper Lee', 13.99, 'A gripping tale of racial injustice and childhood innocence', 'Fiction', 30),
('1984', 'George Orwell', 14.99, 'Dystopian social science fiction novel', 'Fiction', 45),
('Pride and Prejudice', 'Jane Austen', 11.99, 'A romantic novel of manners written in 1813', 'Fiction', 40),
('The Catcher in the Rye', 'J.D. Salinger', 13.49, 'A coming-of-age story set in the 1950s', 'Fiction', 35),

-- Technology & Programming
('Clean Code', 'Robert Martin', 45.99, 'A handbook of agile software craftsmanship', 'Technology', 25),
('Java: The Complete Reference', 'Herbert Schildt', 55.99, 'Comprehensive Java programming guide', 'Technology', 20),
('Python Crash Course', 'Eric Matthes', 39.99, 'A hands-on, project-based introduction to programming', 'Technology', 30),
('JavaScript: The Good Parts', 'Douglas Crockford', 29.99, 'The beautiful, elegant, lightweight subset of JavaScript', 'Technology', 25),
('Design Patterns', 'Gang of Four', 49.99, 'Elements of reusable object-oriented software', 'Technology', 15),

-- Business & Finance
('The Psychology of Money', 'Morgan Housel', 18.99, 'Timeless lessons on wealth and happiness', 'Finance', 35),
('Rich Dad Poor Dad', 'Robert Kiyosaki', 16.99, 'What the rich teach their kids about money', 'Finance', 40),
('The Lean Startup', 'Eric Ries', 22.99, 'How constant innovation creates radically successful businesses', 'Business', 30),
('Good to Great', 'Jim Collins', 19.99, 'Why some companies make the leap and others dont', 'Business', 25),
('Atomic Habits', 'James Clear', 17.99, 'An easy and proven way to build good habits', 'Self-Help', 45),

-- Science & Education
('A Brief History of Time', 'Stephen Hawking', 15.99, 'From the Big Bang to Black Holes', 'Science', 20),
('Sapiens', 'Yuval Noah Harari', 18.99, 'A brief history of humankind', 'History', 35),
('The Selfish Gene', 'Richard Dawkins', 16.99, 'The evolutionary biology classic', 'Science', 25),
('Cosmos', 'Carl Sagan', 14.99, 'A personal voyage through the universe', 'Science', 30),
('Thinking, Fast and Slow', 'Daniel Kahneman', 20.99, 'The psychology of decision making', 'Psychology', 25),

-- Mystery & Thriller
('The Girl with the Dragon Tattoo', 'Stieg Larsson', 13.99, 'A gripping mystery thriller', 'Mystery', 40),
('Gone Girl', 'Gillian Flynn', 12.99, 'A psychological thriller about a marriage gone wrong', 'Thriller', 35),
('The Da Vinci Code', 'Dan Brown', 11.99, 'A mystery thriller involving secret societies', 'Mystery', 50),
('The Silent Patient', 'Alex Michaelides', 14.99, 'A psychological thriller about a woman who refuses to speak', 'Thriller', 30),

-- Fantasy & Adventure
('The Hobbit', 'J.R.R. Tolkien', 15.99, 'A fantasy novel about a hobbits unexpected journey', 'Fantasy', 45),
('Harry Potter and the Sorcerers Stone', 'J.K. Rowling', 16.99, 'The first book in the magical Harry Potter series', 'Fantasy', 60),
('The Chronicles of Narnia', 'C.S. Lewis', 13.99, 'A series of fantasy novels about magical adventures', 'Fantasy', 40);