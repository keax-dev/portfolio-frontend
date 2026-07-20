/**
 * Pruebas unitarias de headers, exclusiones y manejo 401 del interceptor de autenticación.
 */
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { UserInfoService } from '@core/services/user-info.service';
import { SessionService } from '@core/services/session.service';
import { environment } from '@src/environments/environment';
import { TestBed } from '@angular/core/testing';

describe('authInterceptor', () => {
  const baseUrl = environment.url;
  let http: HttpClient;
  let controller: HttpTestingController;
  let session: {
    normalizeStoredSession: ReturnType<typeof vi.fn>;
    handleExpiredSessionRedirect: ReturnType<typeof vi.fn>;
  };
  let userInfo: {
    hasValidSession: boolean;
    hasStoredSession: boolean;
    token: string;
  };

  beforeEach(() => {
    session = {
      normalizeStoredSession: vi.fn(),
      handleExpiredSessionRedirect: vi.fn(),
    };
    userInfo = {
      hasValidSession: true,
      hasStoredSession: true,
      token: 'access-token',
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: SessionService, useValue: session },
        { provide: UserInfoService, useValue: userInfo },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => controller.verify());

  // Caso: normaliza la sesión y agrega headers API para un token válido.
  it('normalizes the session and adds API headers for a valid token', () => {
    http.get(`${baseUrl}/profile`).subscribe();

    const request = controller.expectOne(`${baseUrl}/profile`);
    expect(session.normalizeStoredSession).toHaveBeenCalledOnce();
    expect(request.request.headers.get('Accept')).toBe('application/json');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-token');
    request.flush({});
  });

  // Caso: agrega Accept pero no Authorization cuando no hay una sesión válida.
  it('adds Accept but not Authorization without a valid session', () => {
    userInfo.hasValidSession = false;
    http.get(`${baseUrl}/portfolio`).subscribe();

    const request = controller.expectOne(`${baseUrl}/portfolio`);
    expect(request.request.headers.get('Accept')).toBe('application/json');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  // Caso: no modifica solicitudes externas.
  it('does not modify external requests', () => {
    http.get('https://example.com/public').subscribe();
    const request = controller.expectOne('https://example.com/public');
    expect(request.request.headers.has('Accept')).toBe(false);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });

  // Caso: finaliza una sesión activa después de una respuesta 401 protegida.
  it('ends an active session after a protected 401 response', () => {
    const next = vi.fn();
    const error = vi.fn();
    const complete = vi.fn();
    http.get(`${baseUrl}/profile`).subscribe({ next, error, complete });

    controller
      .expectOne(`${baseUrl}/profile`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(session.handleExpiredSessionRedirect).toHaveBeenCalledOnce();
    expect(error).not.toHaveBeenCalled();
    expect(complete).toHaveBeenCalledOnce();
  });

  // Caso: propaga respuestas 401 del login sin expirar la sesión.
  it('propagates login 401 responses without expiring the session', () => {
    const error = vi.fn();
    http.post(`${baseUrl}/auth/login`, {}).subscribe({ error });

    controller
      .expectOne(`${baseUrl}/auth/login`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(session.handleExpiredSessionRedirect).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledOnce();
  });

  // Caso: propaga errores distintos de 401.
  it('propagates non-401 errors', () => {
    const error = vi.fn();
    http.get(`${baseUrl}/profile`).subscribe({ error });

    controller
      .expectOne(`${baseUrl}/profile`)
      .flush({}, { status: 500, statusText: 'Server Error' });

    expect(session.handleExpiredSessionRedirect).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledOnce();
  });
});
