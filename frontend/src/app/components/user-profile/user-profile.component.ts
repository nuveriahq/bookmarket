// components/user-profile/user-profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    const username = this.authService.getUsername();
    if (username) {
      this.userService.getUserProfile(username).subscribe({
        next: (user: User) => {
          this.user = user;
          this.populateForm();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error loading user profile:', error);
          this.errorMessage = 'Failed to load profile';
          this.isLoading = false;
        }
      });
    }
  }

  populateForm(): void {
    if (this.user) {
      this.profileForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        address: this.user.address,
        age: this.user.age
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.populateForm(); // Reset form to original values
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid && this.user) {
      this.isLoading = true;
      const updatedUser = { ...this.user, ...this.profileForm.value };
      
      this.userService.updateUserProfile(updatedUser).subscribe({
        next: (user: User) => {
          this.user = user;
          this.isEditing = false;
          this.successMessage = 'Profile updated successfully!';
          this.errorMessage = '';
          this.isLoading = false;
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error: any) => {
          console.error('Error updating profile:', error);
          this.errorMessage = 'Failed to update profile';
          this.isLoading = false;
        }
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isLoading = true;
      const passwordData = this.passwordForm.value;
      
      this.userService.changePassword(passwordData).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.successMessage = 'Password changed successfully!';
            this.errorMessage = '';
            this.passwordForm.reset();
          } else {
            this.errorMessage = response.message || 'Failed to change password';
            this.successMessage = '';
          }
          this.isLoading = false;
          setTimeout(() => {
            this.successMessage = '';
            this.errorMessage = '';
          }, 3000);
        },
        error: (error: any) => {
          console.error('Error changing password:', error);
          this.errorMessage = error.error?.message || 'Failed to change password. Please check your current password.';
          this.successMessage = '';
          this.isLoading = false;
        }
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['min']) return 'Age must be at least 1';
      if (field.errors['max']) return 'Age must be less than 120';
    }
    return '';
  }

  getPasswordError(fieldName: string): string {
    const field = this.passwordForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return 'Password must be at least 6 characters';
    }
    
    if (fieldName === 'confirmPassword' && this.passwordForm.errors?.['passwordMismatch']) {
      return 'Passwords do not match';
    }
    
    return '';
  }

  navigateToOrders(): void {
    this.router.navigate(['/orders']);
  }
}
