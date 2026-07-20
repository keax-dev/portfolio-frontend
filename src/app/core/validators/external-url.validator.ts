import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function httpsUrlValidator(): ValidatorFn {
  return (control: AbstractControl<unknown>): ValidationErrors | null => {
    if (typeof control.value !== 'string' || !control.value.trim()) return null;

    try {
      const url = new URL(control.value.trim());
      return url.protocol === 'https:' && Boolean(url.hostname) ? null : { httpsUrl: true };
    } catch {
      return { httpsUrl: true };
    }
  };
}
