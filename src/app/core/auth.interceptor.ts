import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    if (token) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next.handle(clonedReq).pipe(

      // 🔥 Handle 401 here
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          alert('Session expired. Please login again');
          UserService.prototype.logout(); // Clear user data and token
          window.location.href = '/login';
        }

        return throwError(() => error);
      }));
    }

    return next.handle(req);
  }
}