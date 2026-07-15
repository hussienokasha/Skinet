import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Pagination } from '../models/pagination';
import { Product } from '../models/product';
import { ShopParams } from '../../shared/models/shopParams';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private basedUrl = environment.apiUrl;
  types = signal<string[]>([]);
  brands = signal<string[]>([]);

  getProducts(shopParms: ShopParams): Observable<Pagination<Product>> {
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

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.basedUrl}products/${id}`);
  }

  getTypes(): Observable<string[] | null> {
    if (this.types().length > 0) return of(null);
    return this.http.get<string[]>(`${this.basedUrl}products/types`).pipe(
      tap((data) => this.types.set(data)),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }

  getBrands(): Observable<string[] | null> {
    if (this.brands().length > 0) return of(null);
    return this.http.get<string[]>(`${this.basedUrl}products/brands`).pipe(
      tap((data) => this.brands.set(data)),
      catchError((err) => {
        console.log(err);
        return of(null);
      })
    );
  }
}
