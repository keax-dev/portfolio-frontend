/**
 * Pruebas unitarias de persistencia, vigencia y decodificación JWT de UserInfoService.
 */
import { UserInfoService } from './user-info.service';
import { TestBed } from '@angular/core/testing';

describe('UserInfoService', () => {
  let service: UserInfoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [UserInfoService] });
    service = TestBed.inject(UserInfoService);
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // Caso: inicia sin una sesión almacenada.
  it('starts without a stored session', () => {
    expect(service.getToken).toBe('');
    expect(service.getTimeExpiration).toBe(0);
    expect(service.hasStoredSession).toBe(false);
    expect(service.hasValidSession).toBe(false);
  });

  // Caso: restaura un token y una expiración almacenados.
  it('restores a stored token and expiration', () => {
    localStorage.setItem('token', 'stored-token');
    localStorage.setItem('expiration', '1700000000000');

    const restored = new UserInfoService();

    expect(restored.getToken).toBe('stored-token');
    expect(restored.getTimeExpiration).toBe(1_700_000_000_000);
    expect(restored.hasStoredSession).toBe(true);
  });

  // Caso: persiste el token y la expiración mediante los setters.
  it('persists token and expiration through the setters', () => {
    service.setToken = 'new-token';
    service.setTimeExpiration = 1_800_000_000_000;

    expect(localStorage.getItem('token')).toBe('new-token');
    expect(localStorage.getItem('expiration')).toBe('1800000000000');
  });

  // Caso: informa la vigencia de la sesión y el tiempo restante usando la hora actual.
  it('reports session validity and remaining time using the current time', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);
    service.setToken = 'token';
    service.setTimeExpiration = 2_500;

    expect(service.hasValidSession).toBe(true);
    expect(service.remainingSessionTime).toBe(1_500);

    service.setTimeExpiration = 500;
    expect(service.hasValidSession).toBe(false);
    expect(service.remainingSessionTime).toBe(0);
  });

  // Caso: limpia la memoria y el almacenamiento local.
  it('clears memory and local storage', () => {
    service.setToken = 'token';
    service.setTimeExpiration = 2_000;

    service.clearInfo();

    expect(service.getToken).toBe('');
    expect(service.getTimeExpiration).toBe(0);
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('expiration')).toBeNull();
  });

  // Caso: trata setInfo como un reinicio de sesión.
  it('treats setInfo as a session reset', () => {
    service.setToken = 'token';
    service.setTimeExpiration = 2_000;

    service.setInfo();

    expect(service.hasStoredSession).toBe(false);
  });

  // Caso: lee la expiración desde un payload JWT válido.
  it('reads the expiration from a valid JWT payload', () => {
    const payload = btoa(JSON.stringify({ exp: 1_700_000_000 }));
    const token = `header.${payload}.signature`;

    expect(service.resolveTokenExpiration(token)).toBe(1_700_000_000_000);
  });

  // Caso: lee un payload JWT codificado en base64url.
  it('reads a base64url JWT payload', () => {
    const payload = btoa(JSON.stringify({ exp: 1_700_000_001 }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    expect(service.resolveTokenExpiration(`header.${payload}.signature`)).toBe(1_700_000_001_000);
  });

  // Caso: rechaza un JWT sin una expiración numérica.
  it('rejects a JWT without a numeric expiration', () => {
    const payload = btoa(JSON.stringify({ exp: 'tomorrow' }));
    expect(service.resolveTokenExpiration(`header.${payload}.signature`)).toBeNull();
  });

  // Caso: rechaza un payload JWT mal formado.
  it('rejects a malformed JWT payload', () => {
    expect(service.resolveTokenExpiration('not-a-jwt')).toBeNull();
  });

  // Caso: ignora una expiración almacenada mal formada.
  it('ignores a malformed stored expiration', () => {
    localStorage.setItem('expiration', 'not-a-number');
    expect(new UserInfoService().getTimeExpiration).toBe(0);
  });
});
