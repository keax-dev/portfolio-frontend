/**
 * Prueba de integración del formulario LoginComponent con LoginService, HttpClient y localStorage.
 * Recorre el flujo desde eventos DOM hasta persistencia de sesión y navegación.
 */
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginComponent } from '@features/auth/pages/login/login.component';
import { AlertService } from '@core/services/alert.service';
import { environment } from '@src/environments/environment';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

describe('Login flow integration', () => {
  const baseUrl = environment.url;

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  // Caso: envía credenciales desde el DOM, persiste el JWT recibido y navega al home.
  it('submits DOM credentials, persists the returned JWT and navigates home', async () => {
    // Configura servicios HTTP reales y sustituye únicamente dependencias visuales.
    const router = { navigateByUrl: vi.fn().mockResolvedValue(true) };
    const spinner = { show: vi.fn(), hide: vi.fn() };
    const alert = { success: vi.fn(), httpError: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: NgxSpinnerService, useValue: spinner },
        { provide: AlertService, useValue: alert },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    const controller = TestBed.inject(HttpTestingController);

    // Escribe como un usuario real para integrar DOM y Reactive Forms.
    setInput(fixture.nativeElement.querySelector('#username'), 'admin');
    setInput(fixture.nativeElement.querySelector('#password'), 'secret');
    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit'),
    );

    // El servicio debe construir el contrato HTTP esperado.
    const request = controller.expectOne(`${baseUrl}/auth/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      username: 'admin',
      password: 'secret',
    });

    // Responde con un JWT futuro y verifica todos los efectos integrados.
    const expirationSeconds = Math.floor(Date.now() / 1000) + 3_600;
    const payload = btoa(JSON.stringify({ exp: expirationSeconds }));
    const token = `header.${payload}.signature`;
    request.flush({
      status: true,
      alert: 'Welcome',
      data: { token },
    });

    expect(localStorage.getItem('token')).toBe(token);
    expect(localStorage.getItem('expiration')).toBe(String(expirationSeconds * 1000));
    expect(alert.success).toHaveBeenCalledWith('Welcome');
    expect(spinner.hide).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
    controller.verify();
  });

  function setInput(input: HTMLInputElement, value: string): void {
    // Simula el evento utilizado por ControlValueAccessor para actualizar el formulario.
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }
});
