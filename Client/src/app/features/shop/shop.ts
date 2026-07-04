import { Component, inject, signal } from '@angular/core';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/services/product-service';
import { CurrencyPipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { FilterDialog } from './filter-dialog/filter-dialog';
import { SelectModule } from 'primeng/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ShopParams } from '../../shared/models/shopParams';
import { Pagination } from '../../core/models/pagination';

@Component({
  selector: 'app-shop',
  imports: [CurrencyPipe, SelectModule, FormsModule, PaginatorModule,ReactiveFormsModule],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
  providers: [DialogService],
})
export class Shop {
  searchTerm = new FormControl('');
  shopParams = new ShopParams();
  products = signal<Pagination<Product>>({} as Pagination<Product>);
  productService = inject(ProductService);
  dialogService = inject(DialogService);

  sortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Price: Low to High', value: 'priceAsc' },
    { label: 'Price: High to Low', value: 'priceDesc' },
  ];

  ngOnInit() {
    this.initProducts();
  }
  initProducts() {
    this.productService.getProducts(this.shopParams).subscribe({
      next: (data) => {
        this.products.set(data);
      },
      error: (err) => console.log(err),
    });
  }
  showFilterDialog() {
    this.dialogService
      .open(FilterDialog, {
        data: {
          selectedBrands: this.shopParams.brands,
          selectedTypes: this.shopParams.types,
        },
        header: 'Filter Products',
        width: '25rem',
        closeOnEscape: true,
        dismissableMask: true,
        closable: true,
      })
      ?.onClose.subscribe((data) => {
        if (data) {
          this.shopParams.brands = data.brands;
          this.shopParams.types = data.types;
          this.shopParams.pageIndex = 1;

          this.initProducts();
        }
      });
  }
  onSortChange(event: any) {
    const value = event.value;
    this.shopParams.sort = value;
    this.shopParams.pageIndex = 1;
    this.initProducts();
  }

  onPageChange($event: PaginatorState) {
    this.shopParams.pageIndex = ($event.page ?? 0) + 1;
    this.shopParams.pageSize = $event.rows ?? this.shopParams.pageSize;

    this.initProducts();
  }
  onSearch() {
    this.shopParams.pageIndex = 1;
    this.shopParams.search = this.searchTerm.value ?? '';
    this.initProducts();
  }
}
