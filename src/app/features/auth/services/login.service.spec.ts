/**
 * Pruebas unitarias del contrato HTTP utilizado para autenticar credenciales.
 */
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { environment } from '@src/environments/environment';
import { TestBed } from '@angular/core/testing';

describe('LoginService', () => {
  // Caso: envía credenciales al endpoint de login.
  it('posts credentials to the login endpoint', () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const service = TestBed.inject(LoginService);
    const http = TestBed.inject(HttpTestingController);
    const credentials = { username: 'admin', password: 'secret' };

    service.login(credentials).subscribe();

    const request = http.expectOne(`${environment.url}/auth/login`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);
    request.flush({ status: true, alert: 'ok', data: { token: 'token' } });
    http.verify();
  });
});
