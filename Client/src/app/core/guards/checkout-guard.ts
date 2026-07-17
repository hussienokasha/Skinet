import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart-service';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export const checkoutGuard: CanActivateFn = () => {
  const cartService = inject(CartService);
  const messageService = inject(MessageService);
  const router = inject(Router);
  if (!cartService.cart()) {
    messageService.add({
      severity: 'error',
      summary: 'Your Cart is Empty',
      life: 3000
    });
    router.navigate(['/shop']);
    return false;
  }
  return true;
};
