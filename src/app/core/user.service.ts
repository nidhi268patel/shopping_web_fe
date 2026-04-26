import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  // 🟢 Signup
  signup(data: any) {
    return this.http.post(`${this.baseUrl}/signup`, data);
  }

  // 🔵 Login
  login(email: string, password: string) {

  let params = new HttpParams()
    .set('email', email)
    .set('password', password);

  return this.http.get('http://localhost:8080/api/user/login', { params });
  }
   logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}