// components/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card auth-card">
            <div class="card-header text-center">
              <h3 class="text-primary mb-0">📚 Welcome to Bookverse</h3>
              <p class="text-secondary mt-2 mb-0">Sign in to your account</p>
            </div>
            <div class="card-body">
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">
                    <i class="fas fa-user me-2"></i>Username
                  </label>
                  <input type="text" class="form-control" id="username" 
                         formControlName="username" required
                         placeholder="Enter your username">
                  <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" 
                       class="text-danger mt-1">
                    <i class="fas fa-exclamation-circle me-1"></i>Username is required
                  </div>
                </div>
                
                <div class="mb-4">
                  <label for="password" class="form-label">
                    <i class="fas fa-lock me-2"></i>Password
                  </label>
                  <input type="password" class="form-control" id="password" 
                         formControlName="password" required
                         placeholder="Enter your password">
                  <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                       class="text-danger mt-1">
                    <i class="fas fa-exclamation-circle me-1"></i>Password is required
                  </div>
                </div>
                
                <button type="submit" class="btn btn-primary w-100 py-2" 
                        [disabled]="loginForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  <i *ngIf="!loading" class="fas fa-sign-in-alt me-2"></i>
                  {{ loading ? 'Signing in...' : 'Sign In' }}
                </button>
              </form>
              
              <div class="text-center mt-4">
                <p class="text-secondary">
                  Don't have an account? 
                  <a routerLink="/register" class="text-primary fw-bold">Create one here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.toastService.showSuccess('Login successful! Welcome to Bookverse!');
          if (response.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/books']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.toastService.showError('Invalid credentials. Please try again.');
        }
      });
    }
  }
}
