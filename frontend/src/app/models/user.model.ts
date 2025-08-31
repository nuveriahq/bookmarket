// models/user.model.ts
export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  address: string;
  customerId?: string;
  role: 'ADMIN' | 'CUSTOMER';
  age: number;
  createdDate?: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  address: string;
  age: number;
}

export interface AuthResponse {
  message: string;
  token?: string;
  username: string;
  role: string;
}