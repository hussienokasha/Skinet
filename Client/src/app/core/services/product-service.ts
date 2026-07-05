import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Pagination } from '../models/pagination';
import { Product } from '../models/product';
import { ShopParams } from '../../shared/models/shopParams';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private basedUrl = 'http://localhost:5245/api/';
  types = signal<string[]>([]);
  brands = signal<string[]>([]);

  getProducts(shopParms:ShopParams) {
    let params = new HttpParams();
    if (shopParms.types.length > 0) {
      params = params.append('types', shopParms.types.join(','));
    }
    if (shopParms.brands.length > 0) {
      params = params.append('brands', shopParms.brands.join(','));
    }
    if (shopParms.sort) {
      params = params.append('sort', shopParms.sort);
    }
    params = params.append('pageSize', shopParms.pageSize.toString());
    params = params.append('pageIndex', shopParms.pageIndex.toString());
    if (shopParms.search) {
      params = params.append('search', shopParms.search);
    }
    return this.http.get<Pagination<Product>>(`${this.basedUrl}products`, { params });
  }
  getProduct(id: number) {
    return this.http.get<Product>(`${this.basedUrl}products/${id}`);
  }
  getTypes() {
    if (this.types().length > 0) return;
    return this.http.get<string[]>(`${this.basedUrl}products/types`).subscribe({
      next: (data) => {
        this.types.set(data);
      },
      error: (err) => console.log(err),
    });
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
