import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, finalize } from 'rxjs';
import { LoadingService } from '../services/loading-service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  let loader = inject(LoadingService)
  loader.show()
  return next(req).pipe(
    
    finalize(() => loader.hide())
  );
};
