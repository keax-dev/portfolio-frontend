/**
 * Pruebas unitarias de restauración y persistencia del idioma soportado.
 */
import { TranslateService } from '@core/services/translate.service';

describe('TranslateService', () => {
  beforeEach(() => localStorage.clear());

  // Caso: restaura un idioma soportado y lo expone como señal.
  it('restores a supported language and exposes it as a signal', () => {
    localStorage.setItem('language', 'en');

    const service = new TranslateService();

    expect(service.language()).toBe('en');
  });

  // Caso: ignora valores de idioma no soportados.
  it('ignores unsupported language values', () => {
    const service = new TranslateService();

    service.setLang = 'fr';

    expect(service.language()).toBe('es');
    expect(localStorage.getItem('language')).toBeNull();
  });

  // Caso: persiste un idioma soportado.
  it('persists a supported language', () => {
    const service = new TranslateService();

    service.setLang = 'en';

    expect(service.language()).toBe('en');
    expect(localStorage.getItem('language')).toBe('en');
  });

  // Caso: traduce textos localizados según el idioma activo.
  it('translates localized text using the active language', () => {
    const service = new TranslateService();

    expect(service.text({ en: 'Save', es: 'Guardar' })).toBe('Guardar');

    service.setLang = 'en';
    expect(service.text({ en: 'Save', es: 'Guardar' })).toBe('Save');
  });
});
