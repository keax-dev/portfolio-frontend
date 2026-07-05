import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private readonly expirationStorageKey = 'expiration';
  private readonly tokenStorageKey = 'token';

  private timeExpiration = 0;
  private token = '';

  constructor() {
    this.timeExpiration = this.loadTimeExpiration();
    this.token = this.loadToken();
  }

  clearInfo(): void {
    this.timeExpiration = 0;
    this.token = '';
    localStorage.removeItem(this.expirationStorageKey);
    localStorage.removeItem(this.tokenStorageKey);
  }

  setInfo(): void {
    this.clearInfo();
  }

  resolveTokenExpiration(token: string): number | null {
    const payload = this.parseJwtPayload(token);
    if (typeof payload?.exp !== 'number') return null;
    return payload.exp * 1000;
  }

  loadTimeExpiration(): number {
    try {
      const storedExpiration = localStorage.getItem(this.expirationStorageKey);
      if (!storedExpiration) return 0;

      const expiration = Number(storedExpiration);
      return Number.isFinite(expiration) ? expiration : 0;
    } catch {
      return 0;
    }
  }

  loadToken(): string {
    try {
      return localStorage.getItem(this.tokenStorageKey) ?? '';
    } catch {
      return '';
    }
  }

  parseJwtPayload(token: string): { exp?: number } | null {
    const [, payload] = token.split('.');
    if (!payload) return null;

    try {
      const normalizedPayload = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');

      return JSON.parse(atob(normalizedPayload)) as { exp?: number };
    } catch {
      return null;
    }
  }

  set setToken(token: string) {
    this.token = token;
    localStorage.setItem(this.tokenStorageKey, token);
  }

  set setTimeExpiration(timeExpiration: number) {
    this.timeExpiration = timeExpiration;
    localStorage.setItem(this.expirationStorageKey, timeExpiration.toString());
  }

  get getToken(): string {
    return this.token;
  }

  get getTimeExpiration(): number {
    return this.timeExpiration;
  }

  get hasValidSession(): boolean {
    return Boolean(this.token) && this.timeExpiration > Date.now();
  }

  get hasStoredSession(): boolean {
    return Boolean(this.token) || this.timeExpiration > 0;
  }

  get remainingSessionTime(): number {
    return Math.max(this.timeExpiration - Date.now(), 0);
  }
}
