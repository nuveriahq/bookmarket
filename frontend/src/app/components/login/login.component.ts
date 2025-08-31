// components/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Login</h3>
            </div>
            <div class="card-body">
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" class="form-control" id="username" 
                         formControlName="username" required>
                  <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" 
                       class="text-danger">
                    Username is required
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" 
                         formControlName="password" required>
                  <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                       class="text-danger">
                    Password is required
                  </div>
                </div>
                
                <div *ngIf="errorMessage" class="alert alert-danger">
                  {{ errorMessage }}
                </div>
                
                <button type="submit" class="btn btn-primary w-100" 
                        [disabled]="loginForm.invalid || loading">
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
              </form>
              
              <div class="text-center mt-3">
                <p>Don't have an account? <a routerLink="/register">Register here</a></p>
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
          if (response.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/books']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      });
    }
  }
}