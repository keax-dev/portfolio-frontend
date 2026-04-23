import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private lang = 'es';

  constructor() {
    this.loadLanguage();
  }

  loadLanguage() {
    const language = localStorage.getItem('language');
    if (language) this.lang = language;
  }

  set setLang(lang: string) {
    localStorage.setItem('language', lang);
    this.lang = lang;
  }

  get getLang() {
    return this.lang;
  }

}
