import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../models/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private basedUrl = environment.apiUrl;


  cart = signal<Cart | null>(null);
  itemsCount = computed(() => {
    const cart = this.cart();

    if (!cart) return 0;

    return cart.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  });
  totalPrice = computed(() => {
    const cart = this.cart();

    if (!cart) return 0;

    return cart.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  });

  getCart() {
    let id = localStorage.getItem('cart_id');
    if (!id) return;
    return this.http.get<Cart>(`${this.basedUrl}cart`, { params: { id } }).subscribe({
      next: (data) => {
        this.cart.set(data);
      },
    });
  }

   setCart(cart: Cart) {
    return this.http.post<Cart>(`${this.basedUrl}cart`, cart).subscribe({
      next: (data) => {
        this.cart.set(data);
      },
      error: (err) => console.log(err),
    });
  }

  addOrUpdateItem(product: CartItem, quantity: number = 1) {
    const cartId = localStorage.getItem('cart_id');
    if (!cartId) {
      const newCartId = Date.now().toString();
      localStorage.setItem('cart_id', newCartId);
      this.cart.set({
        id: newCartId,
        cartItems: [],
      });
    }
    let item = this.cart()?.cartItems.find((x) => x.productId === product.productId);
    if (item) {
      item.quantity += quantity;
    } else {
      product.quantity = quantity;
      this.cart()?.cartItems.push(product);
    }
    this.setCart(this.cart()!);
  }


  deleteCart() {
    let cartId = localStorage.getItem('cart_id');
    if (!cartId) return;
    return this.http.delete(`${this.basedUrl}cart`, { params: { id: cartId } }).subscribe({
      next: () => {
        this.cart.set(null);
        localStorage.removeItem('cart_id');
      },
      error: (err) => console.log(err),
    });
  }

  removeCartItem(product: CartItem) {
    const cart = this.cart();
    if (!cart) return;
    const itemIndex = cart.cartItems.findIndex((x) => x.productId === product.productId);
    if (itemIndex === -1) return;
    cart.cartItems.splice(itemIndex, 1);
      this.setCart(cart);
      if(cart.cartItems.length === 0) this.deleteCart();
  }



  decrementQuantity(product: CartItem) {
    if (product.quantity === 1) return;
    this.addOrUpdateItem(product, -1);
  }
}
