/**
 * Pruebas unitarias de autorización, expiración, temporizadores y logout de SessionService.
 */
import { Router, UrlTree } from '@angular/router';
import { UserInfoService } from './user-info.service';
import { SessionService } from './session.service';
import { AlertService } from './alert.service';
import { TestBed } from '@angular/core/testing';

describe('SessionService', () => {
  let service: SessionService;
  let userInfo: {
    hasValidSession: boolean;
    hasStoredSession: boolean;
    remainingSessionTime: number;
    clearInfo: ReturnType<typeof vi.fn>;
  };
  let alert: {
    warning: ReturnType<typeof vi.fn>;
    success: ReturnType<typeof vi.fn>;
  };
  let router: {
    createUrlTree: ReturnType<typeof vi.fn>;
    navigateByUrl: ReturnType<typeof vi.fn>;
  };
  const loginTree = { route: '/login' } as unknown as UrlTree;

  beforeEach(() => {
    userInfo = {
      hasValidSession: false,
      hasStoredSession: false,
      remainingSessionTime: 1_000,
      clearInfo: vi.fn(),
    };
    alert = { warning: vi.fn(), success: vi.fn() };
    router = {
      createUrlTree: vi.fn().mockReturnValue(loginTree),
      navigateByUrl: vi.fn().mockResolvedValue(true),
    };

    TestBed.configureTestingModule({
      providers: [
        SessionService,
        { provide: UserInfoService, useValue: userInfo },
        { provide: AlertService, useValue: alert },
        { provide: Router, useValue: router },
      ],
    });
    service = TestBed.inject(SessionService);
  });

  afterEach(() => {
    service.stopExpirationWatcher();
    vi.useRealTimers();
  });

  // Caso: permite el acceso a rutas protegidas con una sesión válida.
  it('allows access to protected routes with a valid session', () => {
    userInfo.hasValidSession = true;
    expect(service.resolveProtectedMatch()).toBe(true);
    expect(alert.warning).not.toHaveBeenCalled();
  });

  // Caso: limpia y redirige una sesión almacenada expirada.
  it('clears and redirects an expired stored session', () => {
    userInfo.hasStoredSession = true;

    expect(service.resolveProtectedMatch()).toBe(loginTree);
    expect(userInfo.clearInfo).toHaveBeenCalledOnce();
    expect(alert.warning).toHaveBeenCalledWith('Session expired');
  });

  // Caso: advierte cuando el acceso protegido no tiene sesión.
  it('warns when protected access has no session', () => {
    expect(service.resolveProtectedMatch()).toBe(loginTree);
    expect(alert.warning).toHaveBeenCalledWith('You must sign in to continue');
  });

  // Caso: redirige una sesión válida fuera de las rutas de invitado.
  it('redirects a valid session away from guest routes', () => {
    userInfo.hasValidSession = true;
    const homeTree = { route: '/home' } as unknown as UrlTree;
    router.createUrlTree.mockReturnValue(homeTree);

    expect(service.resolveGuestMatch()).toBe(homeTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/home']);
  });

  // Caso: permite rutas de invitado y limpia una sesión almacenada expirada.
  it('allows guest routes and cleans an expired stored session', () => {
    userInfo.hasStoredSession = true;
    expect(service.resolveGuestMatch()).toBe(true);
    expect(userInfo.clearInfo).toHaveBeenCalledOnce();
  });

  // Caso: asegura una sesión protegida válida e inicia su temporizador.
  it('ensures a valid protected session and starts its watcher', () => {
    userInfo.hasValidSession = true;
    const watcher = vi.spyOn(service, 'startExpirationWatcher');

    expect(service.ensureProtectedSession()).toBe(true);
    expect(watcher).toHaveBeenCalledOnce();
  });

  // Caso: navega a la URL resuelta al asegurar una sesión inválida.
  it('navigates to the resolved URL when ensuring an invalid session', () => {
    expect(service.ensureProtectedSession()).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith(loginTree);
  });

  // Caso: expira la sesión cuando vence el temporizador.
  it('expires the session when the watcher elapses', () => {
    vi.useFakeTimers();
    userInfo.hasValidSession = true;
    userInfo.remainingSessionTime = 500;

    service.startExpirationWatcher();
    vi.advanceTimersByTime(500);

    expect(userInfo.clearInfo).toHaveBeenCalledOnce();
    expect(alert.warning).toHaveBeenCalledWith('Session expired');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  // Caso: no inicia un temporizador sin una sesión válida.
  it('does not start a watcher without a valid session', () => {
    vi.useFakeTimers();
    service.startExpirationWatcher();
    vi.runAllTimers();
    expect(userInfo.clearInfo).not.toHaveBeenCalled();
  });

  // Caso: cierra sesión, limpia el estado y vuelve al portafolio.
  it('logs out, clears the session and returns to the portfolio', () => {
    service.logOut();
    expect(userInfo.clearInfo).toHaveBeenCalledOnce();
    expect(alert.success).toHaveBeenCalledWith('Logged out');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  // Caso: normaliza una sesión almacenada expirada sin mostrar notificación.
  it('normalizes an expired stored session without showing a notification', () => {
    userInfo.hasStoredSession = true;
    service.normalizeStoredSession();
    expect(userInfo.clearInfo).toHaveBeenCalledOnce();
    expect(alert.warning).not.toHaveBeenCalled();
  });
});
