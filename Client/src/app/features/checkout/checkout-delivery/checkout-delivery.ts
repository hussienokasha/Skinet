import { Component, inject, output, signal } from '@angular/core';
import { DeliveryMethod } from '../../../core/models/delivery-method';
import { CheckoutService } from '../../../core/services/checkout-service';
import { CartService } from '../../../core/services/cart-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout-delivery',
  imports: [CommonModule],
  templateUrl: './checkout-delivery.html',
  styleUrl: './checkout-delivery.css',
})
export class CheckoutDelivery {
  checkoutService = inject(CheckoutService);
  cartService = inject(CartService);
  deliveryStatus = output<boolean>();

  ngOnInit() {
    this.getDeliveryMethods();
  }

  getDeliveryMethods() {
    this.checkoutService.getDeliveryMethods().subscribe({
      error: (err) => {
        console.error('Failed to load delivery methods:', err);
      },
    });
  }

  onDeliveryMethodSelect(method: DeliveryMethod) {
    this.checkoutService.selectDeliveryMethod(method);
    this.deliveryStatus.emit(true);
  }
}
