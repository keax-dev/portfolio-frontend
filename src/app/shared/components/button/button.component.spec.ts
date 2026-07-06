/**
 * Pruebas unitarias del estado visual y eventos emitidos por el botón compartido.
 */
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  // Caso: renderiza el texto, el tipo y el estado deshabilitado configurados.
  it('renders configured text, type and disabled state', async () => {
    await TestBed.configureTestingModule({ imports: [ButtonComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('text', 'Send');
    fixture.componentRef.setInput('type', 'button');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).toContain('Send');
    expect(button.type).toBe('button');
    expect(button.disabled).toBe(true);
  });

  // Caso: usa la presentación de cancelación y emite acciones.
  it('uses cancel presentation and emits actions', async () => {
    await TestBed.configureTestingModule({ imports: [ButtonComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ButtonComponent);
    const action = vi.fn();
    fixture.componentInstance.action.subscribe(action);
    fixture.componentRef.setInput('cancel', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    expect(button.textContent).toContain('Cancel');
    expect(button.type).toBe('button');
    expect(button.className).toContain('btn-secondary');
    expect(action).toHaveBeenCalledOnce();
  });
});
