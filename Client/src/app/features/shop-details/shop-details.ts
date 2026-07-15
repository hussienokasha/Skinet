import { Component, inject, OnInit, signal } from '@angular/core';
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
  cartItem?: CartItem;
  quantity = signal(1);

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.initProduct(+id);
      }
    });
  }

  private initProduct(id: number) {
    this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.product.set(data);
        this.cartItem = this.cartService.cart()?.cartItems.find((x) => x.productId === id);
        this.quantity.set(this.cartItem?.quantity ?? 1);
      },
    });
  }

  updateCart() {
    const product = this.product();
    const item = {
      productId: product.id,
      productName: product.name,
      price: product.price,
      pictureUrl: product.pictureUrl,
      quantity: this.quantity(),
      brand: product.brand,
      type: product.type,
    };

    if (this.cartItem) {
      // Item exists - update exact quantity
      this.cartService.setItemQuantity(product.id, this.quantity());
    } else {
      // New item - add it
      this.cartService.addOrUpdateItem(item, this.quantity());
    }
  }
}
