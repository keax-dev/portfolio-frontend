/**
 * Pruebas unitarias de headers, exclusiones y manejo 401 del interceptor de autenticación.
 */
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { authInterceptor } from './auth.interceptor';
import { UserInfoService } from '@core/services/user-info.service';
import { SessionService } from '@core/services/session.service';
import { environment } from '@src/environments/environment';
import { TestBed } from '@angular/core/testing';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let session: {
    normalizeStoredSession: ReturnType<typeof vi.fn>;
    handleExpiredSessionRedirect: ReturnType<typeof vi.fn>;
  };
  let userInfo: {
    hasValidSession: boolean;
    hasStoredSession: boolean;
    getToken: string;
  };
  let spinner: { hide: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    session = {
      normalizeStoredSession: vi.fn(),
      handleExpiredSessionRedirect: vi.fn(),
    };
    userInfo = {
      hasValidSession: true,
      hasStoredSession: true,
      getToken: 'access-token',
    };
    spinner = { hide: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: SessionService, useValue: session },
        { provide: UserInfoService, useValue: userInfo },
        { provide: NgxSpinnerService, useValue: spinner },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  // Caso: normalizes the session and adds API headers for a valid token.
  it('normalizes the session and adds API headers for a valid token', () => {
    http.get(`${environment.url}/profile`).subscribe();

    const request = controller.expectOne(`${environment.url}/profile`);
    expect(session.normalizeStoredSession).toHaveBeenCalledOnce();
    expect(request.request.headers.get('Accept')).toBe('application/json');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-token');
    request.flush({});
  });

  // Caso: adds Accept but not Authorization without a valid session.
  it('adds Accept but not Authorization without a valid session', () => {
    userInfo.hasValidSession = false;
    http.get(`${environment.url}/portfolio`).subscribe();

    const request = controller.expectOne(`${environment.url}/portfolio`);
    expect(request.request.headers.get('Accept')).toBe('application/json');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  // Caso: does not modify external requests.
  it('does not modify external requests', () => {
    http.get('https://ip.guide').subscribe();
    const request = controller.expectOne('https://ip.guide');
    expect(request.request.headers.has('Accept')).toBe(false);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  // Caso: ends an active session after a protected 401 response.
  it('ends an active session after a protected 401 response', () => {
    const next = vi.fn();
    const error = vi.fn();
    const complete = vi.fn();
    http.get(`${environment.url}/profile`).subscribe({ next, error, complete });

    controller
      .expectOne(`${environment.url}/profile`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(spinner.hide).toHaveBeenCalledOnce();
    expect(session.handleExpiredSessionRedirect).toHaveBeenCalledOnce();
    expect(error).not.toHaveBeenCalled();
    expect(complete).toHaveBeenCalledOnce();
  });

  // Caso: propagates login 401 responses without expiring the session.
  it('propagates login 401 responses without expiring the session', () => {
    const error = vi.fn();
    http.post(`${environment.url}/auth/login`, {}).subscribe({ error });

    controller
      .expectOne(`${environment.url}/auth/login`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(session.handleExpiredSessionRedirect).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledOnce();
  });

  // Caso: propagates non-401 errors.
  it('propagates non-401 errors', () => {
    const error = vi.fn();
    http.get(`${environment.url}/profile`).subscribe({ error });

    controller
      .expectOne(`${environment.url}/profile`)
      .flush({}, { status: 500, statusText: 'Server Error' });

    expect(session.handleExpiredSessionRedirect).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledOnce();
  });
});
