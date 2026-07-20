import { TestBed } from '@angular/core/testing';
import { AUTH_STORAGE } from '@core/storage/auth-storage';

describe('AUTH_STORAGE', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('uses tab-scoped storage and removes legacy persistent credentials', () => {
    localStorage.setItem('token', 'legacy');
    localStorage.setItem('expiration', '123');
    const storage = TestBed.inject(AUTH_STORAGE);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('expiration')).toBeNull();
    storage.setItem('token', 'session-token');
    expect(storage.getItem('token')).toBe('session-token');
    storage.removeItem('token');
    expect(storage.getItem('token')).toBeNull();
  });
});
