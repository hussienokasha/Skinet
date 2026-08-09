import { Component, inject, signal } from '@angular/core';
import { CheckoutSummary } from '../../shared/components/checkout-summary/checkout-summary';
import { StepperModule } from 'primeng/stepper';
import { RouterLink } from '@angular/router';
import {
  ConfirmationToken,
  StripeAddressElement,
  StripeAddressElementChangeEvent,
  StripePaymentElement,
  StripePaymentElementChangeEvent,
} from '@stripe/stripe-js';
import { PaymentService } from '../../core/services/payment-service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Address } from '../../core/models/user';
import { CheckoutDelivery } from './checkout-delivery/checkout-delivery';
import { CheckoutReview } from './checkout-review/checkout-review';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [
    JsonPipe,
    CheckoutSummary,
    StepperModule,
    RouterLink,
    CheckboxModule,
    FormsModule,
    CheckoutDelivery,
    CheckoutReview,
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  checked: boolean = false;
  addressElement?: StripeAddressElement;
  paymentElement?: StripePaymentElement;
  paymentService = inject(PaymentService);
  accountService = inject(AccountService);
  completionStatus = signal<{ address: boolean; card: boolean; delivery: boolean }>({
    address: false,
    card: false,
    delivery: false,
  });
  confirmationToken?: ConfirmationToken;
  async ngOnInit() {
    try {
      this.addressElement = await this.paymentService.createAddressElement();
      this.addressElement.mount('#address-element');
      this.addressElement.on('change', this.handleAddressChange);
    } catch (error) {
      console.log(error);
    }
  }

  async getConfirmationToken() {
    if (Object.values(this.completionStatus).every((s) => s == true)) {
      const result = await this.paymentService.createConfirmationToken()
      if(result.error) throw new Error(result.error.message);
      this.confirmationToken = result.confirmationToken;
      console.log(this.confirmationToken)
    }
  }

  handleAddressChange = (e: StripeAddressElementChangeEvent) => {
    this.completionStatus.update((state) => ({
      ...state,
      address: e.complete,
    }));
  };
  handlePaymentChange = (e: StripePaymentElementChangeEvent) => {
    this.completionStatus.update((state) => ({
      ...state,
      card: e.complete,
    }));
  };
  handleDeliveryChange = (e: boolean) => {
    this.completionStatus.update((state) => ({
      ...state,
      delivery: e,
    }));
  };
  async onStepChange(event: any) {
    console.log(event);
    if (event == 3) {
      setTimeout(async () => {
        this.paymentElement = await this.paymentService.createPaymentElement();
        this.paymentElement.mount('#payment-element');
        this.paymentElement.on('change', this.handlePaymentChange);
      }, 0);
    }
     if (event == 4) {
     await this.getConfirmationToken()
     }
  }

  async saveAddress() {
    const result = await this.addressElement?.getValue();
    const stripeAddress = result?.value.address;

    if (!stripeAddress) return;

    const address: Address = {
      line1: stripeAddress.line1,
      line2: stripeAddress.line2 || undefined,
      city: stripeAddress.city,
      state: stripeAddress.state,
      zipCode: stripeAddress.postal_code,
      country: stripeAddress.country,
    };

    if (this.checked) {
      this.accountService.updateAddress(address).subscribe({
        error: (err) => console.error('Failed to save address:', err),
      });
    }
  }
}
