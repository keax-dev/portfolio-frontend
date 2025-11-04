import { inject, Injectable } from '@angular/core';
import { GoogleTranslate } from '../interfaces/google-translate';
import { environment } from '@src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private httpClient = inject(HttpClient);

  private translationApiUrl = environment.apiTranslateUrl;
  private apiKey = environment.apiTranslateKey;
  private lang = 'en';

  constructor() {
    this.loadLanguage();
  }

  loadLanguage() {
    const language = localStorage.getItem('language');
    if (language) this.lang = language;
  }

  translate(text: string): Observable<GoogleTranslate> {
    return this.httpClient.post<GoogleTranslate>(`${this.translationApiUrl}?key=${this.apiKey}`, { q: text, target: 'es', });
  }

  set setLang(lang: string) {
    localStorage.setItem('language', lang);
    this.lang = lang;
  }

  get getLang() {
    return this.lang;
  }

}
