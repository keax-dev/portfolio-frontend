/**
 * Pruebas de integración de HttpClient, authInterceptor y los servicios reales de sesión.
 * Comprueban la propagación del token y el cierre de sesión ante respuestas no autorizadas.
 */
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { UserInfoService } from '@core/services/user-info.service';
import { AlertService } from '@core/services/alert.service';
import { environment } from '@src/environments/environment';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

describe('Authenticated HTTP integration', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let userInfo: UserInfoService;
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };
  let alert: {
    warning: ReturnType<typeof vi.fn>;
    success: ReturnType<typeof vi.fn>;
  };
  let spinner: { hide: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    // Inicializa una sesión real y sustituye únicamente efectos externos de UI/navegación.
    localStorage.clear();
    router = { navigateByUrl: vi.fn().mockResolvedValue(true) };
    alert = { warning: vi.fn(), success: vi.fn() };
    spinner = { hide: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: AlertService, useValue: alert },
        { provide: NgxSpinnerService, useValue: spinner },
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    userInfo = TestBed.inject(UserInfoService);
  });

  afterEach(() => {
    controller.verify();
    localStorage.clear();
  });

  // Caso: lee la sesión real y adjunta su token a las solicitudes API.
  it('reads the real session and attaches its token to API requests', () => {
    // Guarda una sesión mediante la API pública de UserInfoService.
    userInfo.setToken = 'integration-token';
    userInfo.setTimeExpiration = Date.now() + 60_000;

    // Dispara HttpClient para atravesar la cadena real de interceptores.
    http.get(`${environment.url}/profile`).subscribe();
    const request = controller.expectOne(`${environment.url}/profile`);

    // Valida los headers finales recibidos por el backend simulado.
    expect(request.request.headers.get('Authorization')).toBe('Bearer integration-token');
    expect(request.request.headers.get('Accept')).toBe('application/json');
    request.flush({});
  });

  // Caso: limpia y redirige una sesión real después de un 401 protegido.
  it('clears and redirects a real session after a protected 401', () => {
    // Prepara una sesión inicialmente válida.
    userInfo.setToken = 'revoked-token';
    userInfo.setTimeExpiration = Date.now() + 60_000;
    const completed = vi.fn();

    // Responde 401 desde un recurso protegido.
    http.get(`${environment.url}/profile`).subscribe({ complete: completed });
    controller
      .expectOne(`${environment.url}/profile`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    // El interceptor y SessionService deben completar silenciosamente y limpiar el estado.
    expect(completed).toHaveBeenCalledOnce();
    expect(userInfo.hasStoredSession).toBe(false);
    expect(spinner.hide).toHaveBeenCalledOnce();
    expect(alert.warning).toHaveBeenCalledWith('Session expired');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  // Caso: mantiene disponibles los errores 401 del login para el componente de acceso.
  it('keeps login 401 errors available to the login component', () => {
    // Suscribe un manejador para comprobar que el error no sea absorbido.
    const error = vi.fn();
    http.post(`${environment.url}/auth/login`, {}).subscribe({ error });

    controller
      .expectOne(`${environment.url}/auth/login`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    // El flujo de login debe recibir su propio error sin redirección automática.
    expect(error).toHaveBeenCalledOnce();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
