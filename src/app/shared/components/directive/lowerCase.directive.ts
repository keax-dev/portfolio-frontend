import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appLowerCase]',
  standalone: false
})
export class LowerCaseDirective {

  private readonly control = inject(NgControl);

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {

    const input = event.target as HTMLInputElement;
    const uppercased = input.value.toLowerCase();

    input.value = uppercased;

    this.control.control?.setValue(uppercased, { emitEvent: false });
  }

}
