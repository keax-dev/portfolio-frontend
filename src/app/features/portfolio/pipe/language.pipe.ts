import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'language' })
export class LanguagePipe implements PipeTransform {
  transform(object: unknown, key: string, language: string): string {
    if (!object || typeof object !== 'object') return '';

    const translatedKey = language === 'es' ? `${key}_es` : key;
    const source = object as Record<string, unknown>;
    const value = source[translatedKey];

    return typeof value === 'string' ? value : '';
  }
}
