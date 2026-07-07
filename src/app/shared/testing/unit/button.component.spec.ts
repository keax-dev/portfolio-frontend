/**
 * Pruebas unitarias del estado visual y eventos emitidos por el botón compartido.
 */
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from '@shared/components/button/button.component';

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

  // Caso: usa la presentación de cancelación con su texto por defecto y emite acciones.
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

  // Caso: usa el estado de carga para deshabilitar el botón y cambiar su texto.
  it('uses the loading state to disable the button and change its label', async () => {
    await TestBed.configureTestingModule({ imports: [ButtonComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('loadingText', 'Sending...');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('Sending...');
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  // Caso: permite sobrescribir el texto de cancelación para el portfolio público bilingüe.
  it('allows overriding the cancel label when needed', async () => {
    await TestBed.configureTestingModule({ imports: [ButtonComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('cancel', true);
    fixture.componentRef.setInput('cancelText', 'Cancelar');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent).toContain('Cancelar');
  });
});
