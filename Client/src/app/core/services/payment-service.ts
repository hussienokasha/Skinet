import { inject, Injectable } from '@angular/core';
import {
  Stripe,
  StripeAddressElement,
  StripeAddressElementOptions,
  StripeElements,
  loadStripe,
} from '@stripe/stripe-js';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CartService } from './cart-service';
import { Cart } from '../models/cart';
import { firstValueFrom, map } from 'rxjs';
import { AccountService } from './account-service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  cartService = inject(CartService);
  private elements?: StripeElements;
  addressElement?: StripeAddressElement;
  private sripePromise: Promise<Stripe | null>;
  accountService = inject(AccountService);

  constructor() {
    this.sripePromise = loadStripe(environment.stripePublicKey);
  }
  async initializeElements() {
    if (!this.elements) {
      const stripe = await this.getStripeInstance();
      if (stripe) {
        const cart = await firstValueFrom(this.createOrUpdatePaymentIntent());
        this.elements = stripe.elements({
          clientSecret: cart.clientSecret,
          appearance: { labels: 'floating' },
        });
      } else {
        throw new Error('Stripe not found');
      }
    }
    return this.elements;
  }
  async createAddressElement() {
    if (!this.addressElement) {
      const elements = await this.initializeElements();
      if (elements) {
        const user = this.accountService.currentUser();

        let defaultValues: StripeAddressElementOptions['defaultValues'] = {};
        if (user) {
          defaultValues.name = user.firstName + ' ' + user.lastName;
        }
        if (user?.address) {
          defaultValues.address = {
            line1: user.address.line1,
            line2: user.address.line2,
            country: 'EG',
            city: user.address.city,
            state: user.address.state,
            postal_code: user.address.zipCode,
          };
        }
        const options: StripeAddressElementOptions = {
          mode: 'shipping',
          defaultValues,
        };
        this.addressElement = elements.create('address', options);
      } else {
        throw new Error('Stripe not found');
      }
    }
    return this.addressElement;
  }

  getStripeInstance() {
    return this.sripePromise;
  }
  createOrUpdatePaymentIntent() {
    const cart = this.cartService.cart();
    if (!cart) throw new Error('Cart not found');
    return this.http.post<Cart>(this.baseUrl + 'payment/' + cart.id, {}).pipe(
      map((cart) => {
        this.cartService.cart.set(cart);
        return cart;
      }),
    );
  }
}
