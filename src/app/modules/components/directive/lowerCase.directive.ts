import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appLowerCase]',
  standalone: false
})
export class LowerCaseDirective {

  constructor(private control: NgControl) { }

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const uppercased = input.value.toLowerCase();

    input.value = uppercased;

    this.control.control?.setValue(uppercased, { emitEvent: false });
  }

}
