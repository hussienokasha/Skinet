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
    const id = localStorage.getItem('cart_id');
    if (!id) return;
    return this.http.get<Cart>(`${this.basedUrl}cart`, { params: { id } }).subscribe({
      next: (data) => this.cart.set(data),
      error: (err) => console.log(err),
    });
  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(`${this.basedUrl}cart`, cart).subscribe({
      next: (data) => this.cart.set(data),
      error: (err) => console.log(err),
    });
  }

  addOrUpdateItem(product: CartItem, quantityDelta: number = 1) {
    const cartId = localStorage.getItem('cart_id') ?? Date.now().toString();
    if (!localStorage.getItem('cart_id')) {
      localStorage.setItem('cart_id', cartId);
    }

    const currentCart = this.cart();
    const items = currentCart?.cartItems ? [...currentCart.cartItems] : [];

    const existingItemIndex = items.findIndex((x) => x.productId === product.productId);
    if (existingItemIndex >= 0) {
      items[existingItemIndex] = {
        ...items[existingItemIndex],
        quantity: Math.max(1, items[existingItemIndex].quantity + quantityDelta),
      };
    } else {
      // For new items, use the product's quantity field or the delta
      const qty = quantityDelta > 0 ? quantityDelta : (product.quantity || 1);
      items.push({ ...product, quantity: qty });
    }

    const updatedCart: Cart = { id: cartId, cartItems: items };
    this.cart.set(updatedCart);
    this.setCart(updatedCart);
  }

  setItemQuantity(productId: number, newQuantity: number) {
    const currentCart = this.cart();
    if (!currentCart) return;

    const items = [...currentCart.cartItems];
    const existingItemIndex = items.findIndex((x) => x.productId === productId);

    if (existingItemIndex >= 0) {
      items[existingItemIndex] = {
        ...items[existingItemIndex],
        quantity: Math.max(1, newQuantity),
      };
    }

    const updatedCart: Cart = { ...currentCart, cartItems: items };
    this.cart.set(updatedCart);
    this.setCart(updatedCart);
  }

  deleteCart() {
    const cartId = localStorage.getItem('cart_id');
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
    const currentCart = this.cart();
    if (!currentCart) return;

    const updatedItems = currentCart.cartItems.filter((x) => x.productId !== product.productId);
    const updatedCart: Cart = { ...currentCart, cartItems: updatedItems };
    this.cart.set(updatedCart);

    if (updatedItems.length === 0) {
      this.deleteCart();
    } else {
      this.setCart(updatedCart);
    }
  }

  decrementQuantity(product: CartItem) {
    if (product.quantity <= 1) return;
    this.addOrUpdateItem(product, -1);
  }
}
