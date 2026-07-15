import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/services/product-service';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart-service';
import { CartItem } from '../../core/models/cart';

@Component({
  selector: 'app-shop-details',
  imports: [CurrencyPipe],
  templateUrl: './shop-details.html',
  styleUrl: './shop-details.css',
})
export class ShopDetails implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  product = signal<Product>({} as Product);
  quantity = signal(1);
  private productId = signal<number>(0);

  constructor() {
    effect(() => {
      const cart = this.cartService.cart();
      const id = this.productId();
      if (cart && id) {
        const existingItem = cart.cartItems.find(x => x.productId === id);
        this.quantity.set(existingItem?.quantity ?? 1);
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.productId.set(+id);
        this.initProduct(+id);
      }
    });
  }

  private initProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product.set(data);

      },
    });
  }

  addToCart() {
    const product = this.product();
    const quantity = this.quantity();
    const existingItem = this.cartService.cart()?.cartItems.find(x => x.productId === product.id);

    if (existingItem) {
      // Item exists — set exact quantity rather than adding delta
      this.cartService.setItemQuantity(product.id, quantity);
    } else {
      // New item — add with desired quantity
      this.cartService.addOrUpdateItem(
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          pictureUrl: product.pictureUrl,
          quantity,
          brand: product.brand,
          type: product.type,
        },
        quantity
      );
    }
  }
}
