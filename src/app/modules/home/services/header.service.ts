import { UserInfoService } from './../../shared/services/user-info.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@src/environments/environment';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private userInfoService = inject(UserInfoService);

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
        'Authorization': `Bearer ${this.userInfoService.getToken}`
      })
    };
  }

}
