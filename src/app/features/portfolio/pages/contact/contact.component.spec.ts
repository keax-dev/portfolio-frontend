/**
 * Pruebas unitarias de validación, envío y cierre del formulario de contacto.
 */
import { DialogRef } from '@angular/cdk/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { AlertService } from '@core/services/alert.service';
import { TranslateService } from '@core/services/translate.service';
import { PortfolioService } from '@features/portfolio/services/portfolio.service';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let fixture: ComponentFixture<ContactComponent>;
  let component: ContactComponent;
  let portfolio: { sendEmail: ReturnType<typeof vi.fn> };
  let spinner: {
    show: ReturnType<typeof vi.fn>;
    hide: ReturnType<typeof vi.fn>;
  };
  let alert: {
    success: ReturnType<typeof vi.fn>;
    httpError: ReturnType<typeof vi.fn>;
  };
  let dialogRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    portfolio = { sendEmail: vi.fn() };
    spinner = { show: vi.fn(), hide: vi.fn() };
    alert = { success: vi.fn(), httpError: vi.fn() };
    dialogRef = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        TranslateService,
        { provide: PortfolioService, useValue: portfolio },
        { provide: NgxSpinnerService, useValue: spinner },
        { provide: AlertService, useValue: alert },
        { provide: DialogRef, useValue: dialogRef },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => localStorage.clear());

  // Caso: validates name, email and message constraints.
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

  // Caso: does not submit an invalid form.
  it('does not submit an invalid form', () => {
    component.onSubmit();
    expect(component.controls.name.touched).toBe(true);
    expect(portfolio.sendEmail).not.toHaveBeenCalled();
  });

  // Caso: sends a valid form, notifies success and closes as completed.
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
    expect(spinner.show).toHaveBeenCalledOnce();
    expect(spinner.hide).toHaveBeenCalledOnce();
    expect(alert.success).toHaveBeenCalledWith('Message sent');
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  // Caso: reports submission errors without closing the dialog.
  it('reports submission errors without closing the dialog', () => {
    const failure = new Error('offline');
    component.contactForm.setValue({
      name: 'Ada',
      email: 'ada@example.com',
      message: 'Hello!',
    });
    portfolio.sendEmail.mockReturnValue(throwError(() => failure));

    component.onSubmit();

    expect(alert.httpError).toHaveBeenCalledWith(failure, undefined, false);
    expect(spinner.hide).toHaveBeenCalledOnce();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  // Caso: closes with the supplied completion state.
  it('closes with the supplied completion state', () => {
    component.close(false);
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
