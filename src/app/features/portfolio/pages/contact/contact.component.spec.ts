/**
 * Pruebas unitarias de validación, envío y cierre del formulario de contacto.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@core/services/translate.service';
import { PortfolioService } from '@features/portfolio/services/portfolio.service';
import { ContactComponent } from './contact.component';
import { of, throwError } from 'rxjs';
import { AlertService } from '@core/services/alert.service';
import { MatDialogRef } from '@angular/material/dialog';

describe('ContactComponent', () => {
  let fixture: ComponentFixture<ContactComponent>;
  let component: ContactComponent;
  let portfolio: { sendEmail: ReturnType<typeof vi.fn> };
  let alert: {
    success: ReturnType<typeof vi.fn>;
    httpError: ReturnType<typeof vi.fn>;
  };
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    portfolio = { sendEmail: vi.fn() };
    alert = { success: vi.fn(), httpError: vi.fn() };
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        TranslateService,
        { provide: PortfolioService, useValue: portfolio },
        { provide: AlertService, useValue: alert },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => localStorage.clear());

  // Caso: valida las restricciones de nombre, correo y mensaje.
  it('validates name, email and message constraints', () => {
    component.contactForm.setValue({
      name: 'A',
      email: 'invalid',
      message: '1234',
    });

    expect(component.controls.name.hasError('minlength')).toBe(true);
    expect(component.controls.email.hasError('email')).toBe(true);
    expect(component.controls.message.hasError('minlength')).toBe(true);
  });

  // Caso: no envía un formulario inválido.
  it('does not submit an invalid form', () => {
    component.onSubmit();
    expect(component.controls.name.touched).toBe(true);
    expect(portfolio.sendEmail).not.toHaveBeenCalled();
  });

  // Caso: envía un formulario válido, notifica éxito y cierra como completado.
  it('sends a valid form, notifies success and closes as completed', () => {
    const form = {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Hello from the test',
    };
    component.contactForm.setValue(form);
    portfolio.sendEmail.mockReturnValue(
      of({
        status: true,
        alert: 'Message sent',
        data: null,
      }),
    );

    component.onSubmit();

    expect(portfolio.sendEmail).toHaveBeenCalledWith(form);
    expect(component.isSaving()).toBe(false);
    expect(alert.success).toHaveBeenCalledWith('Message sent');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  // Caso: reporta errores de envío sin cerrar el diálogo.
  it('reports submission errors without closing the dialog', () => {
    const failure = new Error('offline');
    component.contactForm.setValue({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hello!',
    });
    portfolio.sendEmail.mockReturnValue(throwError(() => failure));

    component.onSubmit();

    expect(alert.httpError).toHaveBeenCalledWith(failure);
    expect(component.isSaving()).toBe(false);
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  // Caso: cierra con el estado de finalización proporcionado.
  it('closes with the supplied completion state', () => {
    component.close(false);
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
