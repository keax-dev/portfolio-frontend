import { HttpClient } from '@angular/common/http';
import { environment } from '@src/environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  url = environment.url;

  constructor(public http: HttpClient) { }

}
