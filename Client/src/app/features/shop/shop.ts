import { Component, inject, signal } from '@angular/core';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/services/product-service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-shop',
  imports: [CurrencyPipe],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {

    products = signal<Product[]>([]);
  productService = inject(ProductService);
  ngOnInit() {

    this.productService.getProducts().subscribe({
      next: (data) => {
        console.log(data);
        this.products.set(data.data);
      },
      error: (err) => console.log(err),
    });
  }
}
