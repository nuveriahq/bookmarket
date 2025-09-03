// UserController.java
package com.bookstore.controller;

import com.bookstore.dto.UserProfileDto;
import com.bookstore.entity.User;
import com.bookstore.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        try {
            logger.info("Getting profile for user: {}", username);
            
            Optional<User> user = userService.findByUsername(username);
            if (user.isPresent()) {
                User userEntity = user.get();
                UserProfileDto userProfile = new UserProfileDto(
                    userEntity.getId(),
                    userEntity.getUsername(),
                    userEntity.getEmail(),
                    userEntity.getAddress(),
                    userEntity.getAge(),
                    userEntity.getCustomerId(),
                    userEntity.getRole().name(),
                    userEntity.getCreatedDate()
                );
                return ResponseEntity.ok(userProfile);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error getting profile for user {}: {}", username, e.getMessage());
            return ResponseEntity.badRequest().body("Failed to get user profile: " + e.getMessage());
        }
    }
    
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            logger.info("Updating profile for user ID: {}", id);
            
            Optional<User> existingUser = userService.findById(id);
            if (existingUser.isPresent()) {
                User user = existingUser.get();
                
                // Update only allowed fields
                user.setUsername(userDetails.getUsername());
                user.setEmail(userDetails.getEmail());
                user.setAddress(userDetails.getAddress());
                user.setAge(userDetails.getAge());
                
                User updatedUser = userService.updateUser(user);
                
                // Convert to DTO to avoid serialization issues
                UserProfileDto userProfile = new UserProfileDto(
                    updatedUser.getId(),
                    updatedUser.getUsername(),
                    updatedUser.getEmail(),
                    updatedUser.getAddress(),
                    updatedUser.getAge(),
                    updatedUser.getCustomerId(),
                    updatedUser.getRole().name(),
                    updatedUser.getCreatedDate()
                );
                
                logger.info("Profile updated successfully for user: {}", updatedUser.getUsername());
                return ResponseEntity.ok(userProfile);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error updating profile for user ID {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body("Failed to update profile: " + e.getMessage());
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordData) {
        try {
            String username = passwordData.get("username");
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");
            
            if (username == null || currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }
            
            logger.info("Changing password for user: {}", username);
            
            boolean success = userService.changePassword(username, currentPassword, newPassword);
            if (success) {
                logger.info("Password changed successfully for user: {}", username);
                return ResponseEntity.ok(Map.of("message", "Password changed successfully", "success", true));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Current password is incorrect", "success", false));
            }
        } catch (Exception e) {
            logger.error("Error changing password: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to change password: " + e.getMessage());
        }
    }
    
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            logger.info("Getting all users (admin request)");
            
            List<User> users = userService.findAllUsers();
            // Convert to DTOs to avoid serialization issues
            List<UserProfileDto> userDtos = users.stream()
                .map(user -> new UserProfileDto(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getAddress(),
                    user.getAge(),
                    user.getCustomerId(),
                    user.getRole().name(),
                    user.getCreatedDate()
                ))
                .toList();
            
            return ResponseEntity.ok(userDtos);
        } catch (Exception e) {
            logger.error("Error getting all users: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to get users: " + e.getMessage());
        }
    }
}
