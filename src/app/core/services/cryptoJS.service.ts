import { environment } from '@src/environments/environment';
import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoJSService {

  encrypt(text: string): string {
    return AES.encrypt(text.trim(), environment.cryptoJS.trim()).toString();
  }

  decrypt(text: string): string {
    return AES.decrypt(text.trim(), environment.cryptoJS.trim()).toString(enc.Utf8);
  }

}
