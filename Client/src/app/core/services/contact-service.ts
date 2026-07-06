import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
   private http = inject(HttpClient);
  private basedUrl = 'http://localhost:5245/api/';

  error404() {
    return this.http.post(`${this.basedUrl}ErrorHandle/validationerror`,{})
  }
}
