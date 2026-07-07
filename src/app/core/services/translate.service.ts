import { Injectable, signal } from '@angular/core';
import { LocalizedText } from '@core/i18n/ui-text';

export type SupportedLanguage = 'en' | 'es';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private readonly languageStorageKey = 'language';
  private readonly languageState = signal<SupportedLanguage>('es');

  readonly language = this.languageState.asReadonly();

  constructor() {
    this.loadLanguage();
  }

  loadLanguage(): void {
    const language = this.readStoredLanguage();
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

    this.persistLanguage(lang);
    this.languageState.set(lang);
  }

  get getLang(): SupportedLanguage {
    return this.languageState();
  }

  text(value: LocalizedText): string {
    return value[this.getLang];
  }

  private readStoredLanguage(): string | null {
    try {
      return localStorage.getItem(this.languageStorageKey);
    } catch {
      return null;
    }
  }

  private persistLanguage(language: SupportedLanguage): void {
    try {
      localStorage.setItem(this.languageStorageKey, language);
    } catch {
      // Ignora fallos de almacenamiento y conserva el estado solo en memoria.
    }
  }
}
