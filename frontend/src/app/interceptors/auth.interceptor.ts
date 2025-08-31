// interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    
    console.log('AuthInterceptor: Request URL:', req.url);
    console.log('AuthInterceptor: Token exists:', !!token);
    
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log('AuthInterceptor: Adding Authorization header');
      return next.handle(authReq);
    } else {
      console.log('AuthInterceptor: No token found');
    }
    
    return next.handle(req);
  }
}