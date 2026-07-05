/**
 * Pruebas unitarias del contrato HTTP utilizado para autenticar credenciales.
 */
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { TestBed } from '@angular/core/testing';

describe('LoginService', () => {
  // Caso: posts credentials to the login endpoint.
  it('posts credentials to the login endpoint', () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
      ],
    });
    const service = TestBed.inject(LoginService);
    const http = TestBed.inject(HttpTestingController);
    const credentials = { username: 'admin', password: 'secret' };

    service.login(credentials).subscribe();

    const request = http.expectOne('https://api.test/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);
    request.flush({ status: true, alert: 'ok', data: { token: 'token' } });
    http.verify();
  });
});
