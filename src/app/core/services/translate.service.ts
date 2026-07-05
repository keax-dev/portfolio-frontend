import { Injectable, signal } from '@angular/core';

export type SupportedLanguage = 'en' | 'es';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private readonly languageState = signal<SupportedLanguage>('es');

  readonly language = this.languageState.asReadonly();

  constructor() {
    this.loadLanguage();
  }

  loadLanguage(): void {
    const language = localStorage.getItem('language');
    if (this.isSupportedLanguage(language)) {
      this.languageState.set(language);
    }
  }

  isSupportedLanguage(language: string | null): language is SupportedLanguage {
    return language === 'en' || language === 'es';
  }

  set setLang(lang: string) {
    if (!this.isSupportedLanguage(lang)) {
      return;
    }

    localStorage.setItem('language', lang);
    this.languageState.set(lang);
  }

  get getLang(): SupportedLanguage {
    return this.languageState();
  }
}
