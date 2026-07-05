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

  // Caso: allows access to protected routes with a valid session.
  it('allows access to protected routes with a valid session', () => {
    userInfo.hasValidSession = true;
    expect(service.resolveProtectedMatch()).toBe(true);
    expect(alert.warning).not.toHaveBeenCalled();
  });

  // Caso: clears and redirects an expired stored session.
  it('clears and redirects an expired stored session', () => {
    userInfo.hasStoredSession = true;

    expect(service.resolveProtectedMatch()).toBe(loginTree);
    expect(userInfo.clearInfo).toHaveBeenCalledOnce();
    expect(alert.warning).toHaveBeenCalledWith('Session expired');
  });

  // Caso: warns when protected access has no session.
  it('warns when protected access has no session', () => {
    expect(service.resolveProtectedMatch()).toBe(loginTree);
    expect(alert.warning).toHaveBeenCalledWith('Unauthorized');
  });

  // Caso: redirects a valid session away from guest routes.
  it('redirects a valid session away from guest routes', () => {
    userInfo.hasValidSession = true;
    const homeTree = { route: '/home' } as unknown as UrlTree;
    router.createUrlTree.mockReturnValue(homeTree);

    expect(service.resolveGuestMatch()).toBe(homeTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/home']);
  });

  // Caso: allows guest routes and cleans an expired stored session.
  it('allows guest routes and cleans an expired stored session', () => {
    userInfo.hasStoredSession = true;
    expect(service.resolveGuestMatch()).toBe(true);
    expect(userInfo.clearInfo).toHaveBeenCalledOnce();
  });

  // Caso: ensures a valid protected session and starts its watcher.
  it('ensures a valid protected session and starts its watcher', () => {
    userInfo.hasValidSession = true;
    const watcher = vi.spyOn(service, 'startExpirationWatcher');

    expect(service.ensureProtectedSession()).toBe(true);
    expect(watcher).toHaveBeenCalledOnce();
  });

  // Caso: navigates to the resolved URL when ensuring an invalid session.
  it('navigates to the resolved URL when ensuring an invalid session', () => {
    expect(service.ensureProtectedSession()).toBe(false);
    expect(router.navigateByUrl).toHaveBeenCalledWith(loginTree);
  });

  // Caso: expires the session when the watcher elapses.
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

  // Caso: does not start a watcher without a valid session.
  it('does not start a watcher without a valid session', () => {
    vi.useFakeTimers();
    service.startExpirationWatcher();
    vi.runAllTimers();
    expect(userInfo.clearInfo).not.toHaveBeenCalled();
  });

  // Caso: logs out, clears the session and returns to the portfolio.
  it('logs out, clears the session and returns to the portfolio', () => {
    service.logOut();
    expect(userInfo.clearInfo).toHaveBeenCalledOnce();
    expect(alert.success).toHaveBeenCalledWith('Log out');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  // Caso: normalizes an expired stored session without showing a notification.
  it('normalizes an expired stored session without showing a notification', () => {
    userInfo.hasStoredSession = true;
    service.normalizeStoredSession();
    expect(userInfo.clearInfo).toHaveBeenCalledOnce();
    expect(alert.warning).not.toHaveBeenCalled();
  });
});
