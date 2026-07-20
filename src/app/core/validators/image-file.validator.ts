import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const IMAGE_RULES = {
  allowedTypes: ['image/png', 'image/jpeg', 'image/gif'] as const,
  maxBytes: 5 * 1024 * 1024,
} as const;

export function validateImageFile(file: unknown): ValidationErrors | null {
  if (!(file instanceof File)) {
    return null;
  }

  if (!IMAGE_RULES.allowedTypes.some((type) => type === file.type)) {
    return { invalidFileType: true };
  }

  if (file.size > IMAGE_RULES.maxBytes) {
    return { maxFileSize: true };
  }

  return null;
}

export function imageFileValidator(): ValidatorFn {
  return (control: AbstractControl<unknown>): ValidationErrors | null =>
    validateImageFile(control.value);
}
