import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Address, User } from '../models/user';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);

  login(values: any) {
    let params = new HttpParams().append('useCookies', true);
    return this.http.post<User>(this.baseUrl + 'login', values,{params,});
  }
  register(values: any) {
    return this.http.post<User>(this.baseUrl + 'account/register', values);
  }
  logout() {
    return this.http.post(this.baseUrl + 'account/logout', {});
  }
  getCurrentUser() {
    return this.http.get<User>(this.baseUrl + 'account/me',).pipe(
      tap((data) => {
        console.log(data);
        this.currentUser.set(data);
        
      })
    )
  }
  updateAddress(values: Address){
return this.http.post(this.baseUrl + 'account/address', values);
  }
}
