import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart-service';
import { PaymentService } from '../../../core/services/payment-service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-checkout-review',
  imports: [CurrencyPipe],
  templateUrl: './checkout-review.html',
  styleUrl: './checkout-review.css',
})
export class CheckoutReview  {
  cartService = inject(CartService);
  paymentService = inject(PaymentService);
  router = inject(Router);
  messageService = inject(MessageService);
  isProcessing = false;




}
