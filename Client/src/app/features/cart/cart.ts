import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart-service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CheckoutSummary } from "../../shared/components/checkout-summary/checkout-summary";

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink, CheckoutSummary],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  cartService = inject(CartService);
  ngOnInit() {
    this.cartService.getCart();
  }
}
