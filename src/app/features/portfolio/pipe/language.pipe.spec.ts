/**
 * Pruebas unitarias de selección segura de campos traducidos desde datos externos.
 */
import { LanguagePipe } from './language.pipe';

describe('LanguagePipe', () => {
  const pipe = new LanguagePipe();
  const value = { title: 'Engineer', title_es: 'Ingeniero' };

  // Caso: returns the Spanish field for the Spanish language.
  it('returns the Spanish field for the Spanish language', () => {
    expect(pipe.transform(value, 'title', 'es')).toBe('Ingeniero');
  });

  // Caso: returns the default field for another language.
  it('returns the default field for another language', () => {
    expect(pipe.transform(value, 'title', 'en')).toBe('Engineer');
  });

  // Caso: returns an empty string for malformed external data.
  it('returns an empty string for malformed external data', () => {
    expect(pipe.transform({ title: 42 }, 'title', 'en')).toBe('');
  });

  // Caso: returns an empty string for null and primitive inputs.
  it('returns an empty string for null and primitive inputs', () => {
    expect(pipe.transform(null, 'title', 'en')).toBe('');
    expect(pipe.transform('Engineer', 'title', 'en')).toBe('');
  });

  // Caso: returns an empty string when the requested translation is absent.
  it('returns an empty string when the requested translation is absent', () => {
    expect(pipe.transform({ title: 'Engineer' }, 'title', 'es')).toBe('');
  });
});
