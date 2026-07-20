import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { validateImageFile } from '@core/validators/image-file.validator';

export const PROJECT_IMAGE_LIMITS = { min: 1, max: 3 } as const;

export function projectTechnologiesValidator(): ValidatorFn {
  return (control: AbstractControl<unknown>): ValidationErrors | null => {
    const values = Array.isArray(control.value) ? control.value : [];
    if (!values.length) return { required: true };

    const ids = values.map((value) => readNumber(value, 'id'));
    const positions = values.map((value) => readNumber(value, 'position'));
    return hasDuplicates(ids) || hasDuplicates(positions) ? { duplicate: true } : null;
  };
}

export function projectLinksValidator(): ValidatorFn {
  return (control: AbstractControl<unknown>): ValidationErrors | null => {
    const values = Array.isArray(control.value) ? control.value : [];
    const types = values.map((value) => readString(value, 'type'));
    const positions = values.map((value) => readNumber(value, 'position'));
    return hasDuplicates(types) || hasDuplicates(positions) ? { duplicate: true } : null;
  };
}

export function projectImageFilesValidator(existingImageCount: () => number): ValidatorFn {
  return (control: AbstractControl<unknown>): ValidationErrors | null => {
    const images = Array.isArray(control.value)
      ? control.value.filter((value): value is File => value instanceof File)
      : [];
    const totalImages = existingImageCount() + images.length;

    if (totalImages < PROJECT_IMAGE_LIMITS.min) return { required: true };
    if (totalImages > PROJECT_IMAGE_LIMITS.max) return { maxImages: true };

    for (const image of images) {
      const fileError = validateImageFile(image);
      if (fileError) return fileError;
    }

    return null;
  };
}

function hasDuplicates(values: readonly (number | string)[]): boolean {
  return new Set(values).size !== values.length;
}

function readNumber(value: unknown, key: string): number {
  if (!value || typeof value !== 'object') return 0;
  const candidate = (value as Record<string, unknown>)[key];
  return typeof candidate === 'number' ? candidate : 0;
}

function readString(value: unknown, key: string): string {
  if (!value || typeof value !== 'object') return '';
  const candidate = (value as Record<string, unknown>)[key];
  return typeof candidate === 'string' ? candidate : '';
}
