/**
 * Pruebas unitarias de normalización y seguridad de URLs usadas para previsualizar el CV.
 */
import { resolveCvPreviewUrl } from './cv-preview-url';

describe('resolveCvPreviewUrl', () => {
  // Caso: creates a Google Drive preview URL for a trusted Drive link.
  it('creates a Google Drive preview URL for a trusted Drive link', () => {
    expect(resolveCvPreviewUrl('https://drive.google.com/file/d/file_123/view')).toBe(
      'https://drive.google.com/file/d/file_123/preview',
    );
  });

  // Caso: wraps an external HTTPS document in the Google Docs viewer.
  it('wraps an external HTTPS document in the Google Docs viewer', () => {
    const result = resolveCvPreviewUrl('https://example.com/cv.pdf');
    expect(result).toContain('https://docs.google.com/gview?');
    expect(result).toContain('url=https%3A%2F%2Fexample.com%2Fcv.pdf');
  });

  // Caso: rejects executable URL schemes.
  it('rejects executable URL schemes', () => {
    expect(resolveCvPreviewUrl('javascript:alert(1)')).toBeNull();
  });

  // Caso: does not trust Drive-shaped paths from other hosts.
  it('does not trust Drive-shaped paths from other hosts', () => {
    const result = resolveCvPreviewUrl('https://example.com/file/d/file_123/view');
    expect(result).not.toContain('drive.google.com/file/d/file_123');
  });

  // Caso: supports trusted Drive URLs using an id query parameter.
  it('supports trusted Drive URLs using an id query parameter', () => {
    expect(resolveCvPreviewUrl('https://drive.google.com/open?id=file-456')).toBe(
      'https://drive.google.com/file/d/file-456/preview',
    );
  });

  // Caso: rejects malformed and empty URLs.
  it('rejects malformed and empty URLs', () => {
    expect(resolveCvPreviewUrl('')).toBeNull();
    expect(resolveCvPreviewUrl('not a URL')).toBeNull();
  });

  // Caso: wraps regular HTTP documents in the viewer.
  it('wraps regular HTTP documents in the viewer', () => {
    const result = resolveCvPreviewUrl('http://example.com/cv.pdf');
    expect(result).toContain('url=http%3A%2F%2Fexample.com%2Fcv.pdf');
  });
});
