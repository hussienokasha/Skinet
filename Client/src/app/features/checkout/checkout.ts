import { Component, inject } from '@angular/core';
import { CheckoutSummary } from '../../shared/components/checkout-summary/checkout-summary';
import { StepperModule } from 'primeng/stepper';
import { RouterLink } from '@angular/router';
import { StripeAddressElement } from '@stripe/stripe-js';
import { PaymentService } from '../../core/services/payment-service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../core/services/account-service';
import { Address } from '../../core/models/user';

@Component({
  selector: 'app-checkout',
  imports: [CheckoutSummary, StepperModule, RouterLink, CheckboxModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  checked: boolean = false;
  addressElement?: StripeAddressElement;
  paymentService = inject(PaymentService);
  accountService = inject(AccountService);

  async ngOnInit() {
    try {
      this.addressElement = await this.paymentService.createAddressElement();
      this.addressElement.mount('#address-element');

    } catch (error) {
      console.log(error);
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
      this.accountService.updateAddress(address).subscribe();
    }

  }

  ngOnDestroy() {
    this.addressElement?.unmount();
  }
}
