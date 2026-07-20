import { Component, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart-service';
import { CurrencyPipe, Location } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-summary',
  imports: [CurrencyPipe,RouterLink],
  templateUrl: './checkout-summary.html',
  styleUrl: './checkout-summary.css',
})
export class CheckoutSummary {
  cartService = inject(CartService);
  location = inject(Location);


}
