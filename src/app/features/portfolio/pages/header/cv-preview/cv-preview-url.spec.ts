/**
 * Pruebas unitarias de normalización y seguridad de URLs usadas para previsualizar el CV.
 */
import { resolveCvPreviewUrl } from './cv-preview-url';

describe('resolveCvPreviewUrl', () => {
  // Caso: crea una URL de previsualización de Google Drive para un enlace confiable.
  it('creates a Google Drive preview URL for a trusted Drive link', () => {
    expect(resolveCvPreviewUrl('https://drive.google.com/file/d/file_123/view')).toBe(
      'https://drive.google.com/file/d/file_123/preview',
    );
  });

  // Caso: envuelve un documento HTTPS externo en el visor de Google Docs.
  it('wraps an external HTTPS document in the Google Docs viewer', () => {
    const result = resolveCvPreviewUrl('https://example.com/cv.pdf');
    expect(result).toContain('https://docs.google.com/gview?');
    expect(result).toContain('url=https%3A%2F%2Fexample.com%2Fcv.pdf');
  });

  // Caso: rechaza esquemas de URL ejecutables.
  it('rejects executable URL schemes', () => {
    expect(resolveCvPreviewUrl('javascript:alert(1)')).toBeNull();
  });

  // Caso: no confía en rutas con forma de Drive provenientes de otros hosts.
  it('does not trust Drive-shaped paths from other hosts', () => {
    const result = resolveCvPreviewUrl('https://example.com/file/d/file_123/view');
    expect(result).not.toContain('drive.google.com/file/d/file_123');
  });

  // Caso: soporta URLs confiables de Drive usando un parámetro id.
  it('supports trusted Drive URLs using an id query parameter', () => {
    expect(resolveCvPreviewUrl('https://drive.google.com/open?id=file-456')).toBe(
      'https://drive.google.com/file/d/file-456/preview',
    );
  });

  // Caso: rechaza URLs vacías y mal formadas.
  it('rejects malformed and empty URLs', () => {
    expect(resolveCvPreviewUrl('')).toBeNull();
    expect(resolveCvPreviewUrl('not a URL')).toBeNull();
  });

  // Caso: envuelve documentos HTTP regulares en el visor.
  it('wraps regular HTTP documents in the viewer', () => {
    const result = resolveCvPreviewUrl('http://example.com/cv.pdf');
    expect(result).toContain('url=http%3A%2F%2Fexample.com%2Fcv.pdf');
  });
});
