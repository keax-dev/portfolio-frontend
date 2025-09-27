import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  httpOptions!: { headers: HttpHeaders };
  firstInit = true;
  url = environment.url;

  constructor(public http: HttpClient) {
    this.loadHeaders();
  }

  loadHeaders(): void {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ""}`
      })
    };
  }

}
