import { InjectionToken } from '@angular/core';

export interface AuthStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class SafeSessionStorage implements AuthStorage {
  getItem(key: string): string | null {
    try {
      return globalThis.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      globalThis.sessionStorage.setItem(key, value);
    } catch {
      // The in-memory session held by UserInfoService remains available for this page lifecycle.
    }
  }

  removeItem(key: string): void {
    try {
      globalThis.sessionStorage.removeItem(key);
    } catch {
      // The in-memory session held by UserInfoService is still cleared.
    }
  }
}

function clearLegacyPersistentSession(): void {
  try {
    globalThis.localStorage.removeItem('token');
    globalThis.localStorage.removeItem('expiration');
  } catch {
    // Persistent storage may be unavailable; there is no legacy state to migrate in that case.
  }
}

export const AUTH_STORAGE = new InjectionToken<AuthStorage>('AUTH_STORAGE', {
  providedIn: 'root',
  factory: () => {
    clearLegacyPersistentSession();
    return new SafeSessionStorage();
  },
});
