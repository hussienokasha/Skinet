import { Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart-service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe,RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  cartService = inject(CartService);
  ngOnInit() {

  this.cartService.getCart();

  }
}
