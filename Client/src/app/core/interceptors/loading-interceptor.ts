import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { LoadingService } from '../services/loading-service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  let loader = inject(LoadingService)
  loader.show()
  return next(req).pipe(
    delay(3000),
    finalize(() => loader.hide())
  );
};
