import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);
  private basedUrl = environment.apiUrl;

  error404() {
    return this.http.post(`${this.basedUrl}ErrorHandle/validationerror`, {});
  }
}
