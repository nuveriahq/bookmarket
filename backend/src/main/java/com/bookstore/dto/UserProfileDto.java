package com.bookstore.dto;

import java.time.LocalDateTime;

public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String address;
    private Integer age;
    private String customerId;
    private String role;
    private LocalDateTime createdDate;

    // Constructors
    public UserProfileDto() {}

    public UserProfileDto(Long id, String username, String email, String address, 
                         Integer age, String customerId, String role, LocalDateTime createdDate) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.address = address;
        this.age = age;
        this.customerId = customerId;
        this.role = role;
        this.createdDate = createdDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
}
