import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Pagination } from '../models/pagination';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private basedUrl = 'http://localhost:5245/api/';
  types=signal< string[]> ([]);
  brands=signal< string[]> ([]);


  getProducts() {
    return this.http.get<Pagination<Product>>(`${this.basedUrl}products?pageIndex=1&pageSize=20`);
  }
  getTypes() {
    if (this.types().length > 0) return;
    return this.http.get<string[]>(`${this.basedUrl}products/types`).subscribe({
      next: (data) => {
        this.types.set(data);
      },
      error: (err) => console.log(err),
    })
  }
  getBrands() {
    if (this.brands().length > 0) return;
    return this.http.get<string[]>(`${this.basedUrl}products/brands`).subscribe({
      next: (data) => {
        this.brands.set(data);
      },
      error: (err) => console.log(err),
    });
  }
}
