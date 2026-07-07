/**
 * Pruebas de integración del Router con los guards y el almacenamiento real de sesión.
 * Verifican redirecciones completas sin sustituir SessionService ni UserInfoService.
 */
import { RouterTestingHarness } from '@angular/router/testing';
import { guestMatchGuard } from '@core/guards/guest.guard';
import { authMatchGuard } from '@core/guards/auth.guard';
import { provideRouter } from '@angular/router';
import { AlertService } from '@core/services/alert.service';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({ template: '<h1>Login page</h1>' })
class LoginStubComponent {}

@Component({ template: '<h1>Protected home</h1>' })
class HomeStubComponent {}

describe('Auth routing integration', () => {
  let alert: {
    warning: ReturnType<typeof vi.fn>;
    success: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Aísla el almacenamiento y configura rutas reales con ambos guards.
    localStorage.clear();
    alert = { warning: vi.fn(), success: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'login',
            canMatch: [guestMatchGuard],
            component: LoginStubComponent,
          },
          {
            path: 'home',
            canMatch: [authMatchGuard],
            component: HomeStubComponent,
          },
          { path: '**', redirectTo: 'login' },
        ]),
        { provide: AlertService, useValue: alert },
      ],
    });
  });

  afterEach(() => localStorage.clear());

  // Caso: redirige la navegación protegida anónima al login.
  it('redirects anonymous protected navigation to login', async () => {
    // Ejecuta una navegación completa sin credenciales guardadas.
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/home');

    // Confirma tanto la vista final como la advertencia producida por SessionService.
    expect(harness.routeNativeElement?.textContent).toContain('Login page');
    expect(alert.warning).toHaveBeenCalledWith('You must sign in to continue');
  });

  // Caso: permite que una sesión válida almacenada llegue al home protegido.
  it('allows a valid stored session to reach the protected home', async () => {
    // Prepara la misma información que existiría después de un login exitoso.
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('expiration', String(Date.now() + 60_000));

    // Navega usando Router, guard y servicios reales.
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/home');

    // La ruta protegida debe renderizarse sin advertencias.
    expect(harness.routeNativeElement?.textContent).toContain('Protected home');
    expect(alert.warning).not.toHaveBeenCalled();
  });

  // Caso: redirige a los usuarios autenticados fuera de la ruta de login para invitados.
  it('redirects authenticated users away from the guest login route', async () => {
    // Simula una sesión vigente antes de solicitar la página pública de login.
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('expiration', String(Date.now() + 60_000));

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/login');

    // GuestGuard debe convertir la navegación en una redirección hacia home.
    expect(harness.routeNativeElement?.textContent).toContain('Protected home');
  });

  // Caso: limpia una sesión almacenada expirada mientras redirige al login.
  it('clears an expired stored session while redirecting to login', async () => {
    // Conserva un token con una expiración pasada para probar la normalización.
    localStorage.setItem('token', 'expired-token');
    localStorage.setItem('expiration', String(Date.now() - 1));

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/home');

    // La integración debe limpiar ambos valores y explicar la causa al usuario.
    expect(harness.routeNativeElement?.textContent).toContain('Login page');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('expiration')).toBeNull();
    expect(alert.warning).toHaveBeenCalledWith('Session expired');
  });
});
