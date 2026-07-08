import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/services/product-service';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart-service';
import { CartItem } from '../../core/models/cart';

@Component({
  selector: 'app-shop-details',
  imports: [CurrencyPipe, FormsModule],
  templateUrl: './shop-details.html',
  styleUrl: './shop-details.css',
})
export class ShopDetails {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductService);
  product = signal<Product>({} as Product);
  cartService = inject(CartService);
  cartItem?: CartItem;
  productId = this.activatedRoute.snapshot.paramMap.get('id');
  ngOnInit() {
    this.initProduct();
  }
  initProduct() {
    if (this.productId)
      this.productService.getProduct(+this.productId!).subscribe({
        next: (data) => {
          this.product.set(data);
          this.cartItem = this.cartService
            .cart()
            ?.cartItems.find((x) => x.productId === +this.productId!);
        },
      });
  }

  updateCart(quantity: number) {
    if (!this.cartItem) {
      return;
    }

    const cart = this.cartService.cart();
    if (!cart) {
      return;
    }

    const item = cart.cartItems.find((x) => x.productId === this.cartItem!.productId);
    if (item && quantity != this.cartItem.quantity) {
      item.quantity = quantity;
      this.cartService.setCart(cart);
    }
  }
}
