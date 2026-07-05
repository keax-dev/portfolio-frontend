/**
 * Pruebas unitarias de restauración y persistencia del idioma soportado.
 */
import { TranslateService } from './translate.service';

describe('TranslateService', () => {
  beforeEach(() => localStorage.clear());

  // Caso: restores a supported language and exposes it as a signal.
  it('restores a supported language and exposes it as a signal', () => {
    localStorage.setItem('language', 'en');

    const service = new TranslateService();

    expect(service.language()).toBe('en');
  });

  // Caso: ignores unsupported language values.
  it('ignores unsupported language values', () => {
    const service = new TranslateService();

    service.setLang = 'fr';

    expect(service.language()).toBe('es');
    expect(localStorage.getItem('language')).toBeNull();
  });

  // Caso: persists a supported language.
  it('persists a supported language', () => {
    const service = new TranslateService();

    service.setLang = 'en';

    expect(service.language()).toBe('en');
    expect(localStorage.getItem('language')).toBe('en');
  });
});
