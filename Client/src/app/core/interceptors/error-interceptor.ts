import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 400) {
        const validationErrors = err.error?.errors;

        if (validationErrors) {
          const messages = Object.values(validationErrors).flatMap((value: any) =>
            Array.isArray(value) ? value : [value],
          );

          return throwError(() => messages);
        }

        return throwError(() => 'Bad Request');
      }

      if (err.status === 401) {
        messageService.add({
          severity: 'error',
          summary: 'Username or Password is incorrect',
          life: 3000,
        });
        return throwError(() => err.error?.message || 'Unauthorized');
      }

      if (err.status === 404) {
        return throwError(() => err.error?.message || 'Resource not found');
      }

      if (err.status === 500) {
        return throwError(() => err.error?.message || 'Server error');
      }

      return throwError(() => err);
    }),
  );
};
