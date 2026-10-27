import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          localStorage.removeItem('stocksmart_token');
          localStorage.removeItem('stocksmart_user');
          router.navigate(['/login']);
          break;
        case 403:
          router.navigate(['/forbidden']);
          break;
        case 404:
          notifications.error('[ERROR: Resource not found]');
          break;
        case 500:
          notifications.error('[ERROR: Server error — try again]');
          break;
        default:
          notifications.error(`[ERROR: ${error.message}]`);
      }
      return throwError(() => error);
    })
  );
};
