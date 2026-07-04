import { Component, inject, signal } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ProductService } from '../../../core/services/product-service';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-filter-dialog',
  imports: [DialogModule, CheckboxModule, FormsModule],
  templateUrl: './filter-dialog.html',
  styleUrl: './filter-dialog.css',
})
export class FilterDialog {
  selectedBrands: string[] = [];
  selectedTypes: string[] = [];
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  productService = inject(ProductService);
  brands = this.productService.brands;
  types = this.productService.types;

  ngOnInit() {
    this.productService.getBrands();
    this.productService.getTypes();
    this.selectedBrands = this.config.data.selectedBrands;
    this.selectedTypes = this.config.data.selectedTypes
  }
  applyFilters() {

    this.ref.close({ brands: this.selectedBrands, types: this.selectedTypes });
  }
}
