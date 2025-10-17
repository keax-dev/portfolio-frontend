import { inject, Injectable } from '@angular/core';
import { CryptoJSService } from './cryptoJS.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private crypto = inject(CryptoJSService);

  private timeExpiration = 0;
  private token = "";

  constructor() {
    try {
      const timeExpiration = localStorage.getItem("expiration");
      if (timeExpiration) this.timeExpiration = Number(this.crypto.decrypt(timeExpiration));
    } catch (error) {
      this.timeExpiration = 0;
    }

    try {
      const token = localStorage.getItem("token");
      if (token) this.token = this.crypto.decrypt(token);
    } catch (error) {
      this.token = "";
    }
  }

  setInfo(): void {
    this.timeExpiration = 0;
    this.token = "";
  }

  set setToken(token: string) {
    this.token = token;
    localStorage.setItem("token", this.crypto.encrypt(token));
  }

  set setTimeExpiration(timeExpiration: number) {
    this.timeExpiration = timeExpiration;
    localStorage.setItem("expiration", this.crypto.encrypt(timeExpiration.toString()));
  }

  get getToken() {
    return this.token;
  }

  get getTimeExpiration() {
    return this.timeExpiration;
  }

}
