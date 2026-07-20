import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({ selector: '[appLowerCase]' })
export class LowerCaseDirective {
  private readonly control = inject(NgControl);

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const lowercased = input.value.toLowerCase();

    input.value = lowercased;

    this.control.control?.setValue(lowercased, { emitEvent: false });
  }
}
