import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DeliveryMethod } from '../models/delivery-method';
import { CartService } from './cart-service';
import { of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  http = inject(HttpClient);
  cartService = inject(CartService);
  baseUrl = environment.apiUrl;
  deliveryMethods = signal<DeliveryMethod[]>([]);

  getDeliveryMethods() {
    const cart = this.cartService.cart();
    if (!cart) return of([]);

    let params = new HttpParams();

    params = params.append('cartId', cart.id);
    return this.http.get<DeliveryMethod[]>(this.baseUrl + 'payment/delivery-methods',{params}).pipe(
      tap((methods) => this.deliveryMethods.set(methods))
    );
  }

  selectDeliveryMethod(method: DeliveryMethod) {
    this.cartService.shippingPrice.set(method.price);
    const cart = this.cartService.cart();
    if (!cart) return;
    const updatedCart = { ...cart, deliveryMethodId: method.id };
    this.cartService.cart.set(updatedCart);
    this.cartService.setCart(updatedCart);
  }
}
