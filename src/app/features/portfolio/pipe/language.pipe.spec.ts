/**
 * Pruebas unitarias de selección segura de campos traducidos desde datos externos.
 */
import { LanguagePipe } from './language.pipe';

describe('LanguagePipe', () => {
  const pipe = new LanguagePipe();
  const value = { title: 'Engineer', title_es: 'Ingeniero' };

  // Caso: devuelve el campo en español para el idioma español.
  it('returns the Spanish field for the Spanish language', () => {
    expect(pipe.transform(value, 'title', 'es')).toBe('Ingeniero');
  });

  // Caso: devuelve el campo por defecto para otro idioma.
  it('returns the default field for another language', () => {
    expect(pipe.transform(value, 'title', 'en')).toBe('Engineer');
  });

  // Caso: devuelve una cadena vacía para datos externos mal formados.
  it('returns an empty string for malformed external data', () => {
    expect(pipe.transform({ title: 42 }, 'title', 'en')).toBe('');
  });

  // Caso: devuelve una cadena vacía para entradas nulas y primitivas.
  it('returns an empty string for null and primitive inputs', () => {
    expect(pipe.transform(null, 'title', 'en')).toBe('');
    expect(pipe.transform('Engineer', 'title', 'en')).toBe('');
  });

  // Caso: devuelve una cadena vacía cuando falta la traducción solicitada.
  it('returns an empty string when the requested translation is absent', () => {
    expect(pipe.transform({ title: 'Engineer' }, 'title', 'es')).toBe('');
  });
});
