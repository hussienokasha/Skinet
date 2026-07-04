import { Component, inject, signal } from '@angular/core';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/services/product-service';
import { CurrencyPipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { FilterDialog } from './filter-dialog/filter-dialog';

@Component({
  selector: 'app-shop',
  imports: [CurrencyPipe],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
  providers: [DialogService],
})
export class Shop {
  products = signal<Product[]>([]);
  productService = inject(ProductService);
  dialogService = inject(DialogService);
  selectedBrands: string[] = [];
  selectedTypes: string[] = [];

  ngOnInit() {
    this.initProducts();
  }
  initProducts() {
    this.productService.getProducts(this.selectedTypes.join(','), this.selectedBrands.join(',')).subscribe({
      next: (data) => {
        console.log(data);
        this.products.set(data.data);
      },
      error: (err) => console.log(err),
    });

  }
  showFilterDialog() {
    this.dialogService.open(FilterDialog, {
      data: {
        selectedBrands: this.selectedBrands,
        selectedTypes: this.selectedTypes,
      },
        header: 'Filter Products',
        width: '25rem',
        closeOnEscape: true,
        dismissableMask: true,
        closable: true,
    })?.onClose.subscribe((data) => {

      if (data) {
        this.selectedBrands = data.brands;
        this.selectedTypes = data.types;
        this.initProducts();
      }
    }
  )
  }
}
