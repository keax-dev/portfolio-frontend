/**
 * Pruebas unitarias de sincronización entre inputs y controles para las directivas de texto.
 */
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LowerCaseDirective } from './lowerCase.directive';
import { UppercaseDirective } from './uppercase.directive';

@Component({
  template: `
    <input id="upper" [formControl]="upper" appUppercase />
    <input id="lower" [formControl]="lower" appLowerCase />
  `,
  imports: [ReactiveFormsModule, UppercaseDirective, LowerCaseDirective],
})
class HostComponent {
  readonly upper = new FormControl('');
  readonly lower = new FormControl('');
}

describe('text case directives', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  // Caso: uppercases both the input and form control value.
  it('uppercases both the input and form control value', () => {
    const input = fixture.nativeElement.querySelector('#upper') as HTMLInputElement;
    input.value = 'Kevin galarza';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('KEVIN GALARZA');
    expect(fixture.componentInstance.upper.value).toBe('KEVIN GALARZA');
  });

  // Caso: lowercases both the input and form control value.
  it('lowercases both the input and form control value', () => {
    const input = fixture.nativeElement.querySelector('#lower') as HTMLInputElement;
    input.value = 'USER@EXAMPLE.COM';
    input.dispatchEvent(new Event('input'));
    expect(input.value).toBe('user@example.com');
    expect(fixture.componentInstance.lower.value).toBe('user@example.com');
  });
});
