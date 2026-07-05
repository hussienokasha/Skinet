import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/services/product-service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-shop-details',
  imports: [CurrencyPipe],
  templateUrl: './shop-details.html',
  styleUrl: './shop-details.css',
})
export class ShopDetails {
  activatedRoute = inject(ActivatedRoute);
  productService = inject(ProductService);
   product= signal<Product>({} as Product)
  ngOnInit() {
    const productId = this.activatedRoute.snapshot.paramMap.get('id');

    if (productId)
      this.productService.getProduct(+productId).subscribe({
        next: (data) => {
          this.product.set(data);

          console.log(this.product);
        },
        error: (err) => console.log(err),
      });
  }
}
