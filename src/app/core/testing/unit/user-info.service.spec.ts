import { TestBed } from '@angular/core/testing';
import { UserInfoService } from '@core/services/user-info.service';
import { AUTH_STORAGE, AuthStorage } from '@core/storage/auth-storage';

describe('UserInfoService', () => {
  let values: Map<string, string>;
  let storage: AuthStorage;

  beforeEach(() => {
    values = new Map();
    storage = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => void values.delete(key),
    };
  });

  afterEach(() => vi.restoreAllMocks());

  const createService = (): UserInfoService => {
    TestBed.configureTestingModule({
      providers: [UserInfoService, { provide: AUTH_STORAGE, useValue: storage }],
    });
    return TestBed.inject(UserInfoService);
  };

  it('starts without a stored session', () => {
    const service = createService();
    expect(service.token).toBe('');
    expect(service.expiresAt).toBe(0);
    expect(service.hasStoredSession).toBe(false);
    expect(service.hasValidSession).toBe(false);
  });

  it('restores a stored token and expiration', () => {
    values.set('token', 'stored-token');
    values.set('expiration', '1700000000000');
    const service = createService();

    expect(service.token).toBe('stored-token');
    expect(service.expiresAt).toBe(1_700_000_000_000);
    expect(service.hasStoredSession).toBe(true);
  });

  it('persists token and expiration through setSession', () => {
    const service = createService();
    service.setSession('new-token', 1_800_000_000_000);

    expect(values.get('token')).toBe('new-token');
    expect(values.get('expiration')).toBe('1800000000000');
  });

  it('reports session validity and remaining time using the current time', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);
    const service = createService();
    service.setSession('token', 2_500);
    expect(service.hasValidSession).toBe(true);
    expect(service.remainingSessionTime).toBe(1_500);

    service.setSession('token', 500);
    expect(service.hasValidSession).toBe(false);
    expect(service.remainingSessionTime).toBe(0);
  });

  it('clears memory and storage', () => {
    const service = createService();
    service.setSession('token', 2_000);
    service.clearInfo();

    expect(service.token).toBe('');
    expect(service.expiresAt).toBe(0);
    expect(values.has('token')).toBe(false);
    expect(values.has('expiration')).toBe(false);
  });

  it('ignores invalid session metadata and clears the state', () => {
    const service = createService();
    service.setSession('', Number.NaN);
    expect(service.hasStoredSession).toBe(false);
  });

  it('reads numeric expiration from regular and URL-safe JWT payloads', () => {
    const service = createService();
    const payload = btoa(JSON.stringify({ exp: 1_700_000_000 }));
    expect(service.resolveTokenExpiration(`header.${payload}.signature`)).toBe(1_700_000_000_000);

    const urlSafe = btoa(JSON.stringify({ exp: 1_700_000_001 }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    expect(service.resolveTokenExpiration(`header.${urlSafe}.signature`)).toBe(1_700_000_001_000);
  });

  it('rejects malformed JWT payloads and non-numeric expiration', () => {
    const service = createService();
    const payload = btoa(JSON.stringify({ exp: 'tomorrow' }));
    expect(service.resolveTokenExpiration(`header.${payload}.signature`)).toBeNull();
    expect(service.resolveTokenExpiration('not-a-jwt')).toBeNull();
  });

  it('ignores a malformed stored expiration', () => {
    values.set('expiration', 'not-a-number');
    expect(createService().expiresAt).toBe(0);
  });
});
