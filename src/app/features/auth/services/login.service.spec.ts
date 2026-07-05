/**
 * Pruebas unitarias del contrato HTTP utilizado para autenticar credenciales.
 */
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '@core/http/api-base-url.token';
import { LoginService } from './login.service';

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
