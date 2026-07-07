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
    this.removeStorageValue(this.expirationStorageKey);
    this.removeStorageValue(this.tokenStorageKey);
  }

  setSession(token: string, timeExpiration: number): void {
    const normalizedToken = token.trim();
    const normalizedExpiration = Number.isFinite(timeExpiration) ? timeExpiration : 0;

    if (!normalizedToken || normalizedExpiration <= 0) {
      this.clearInfo();
      return;
    }

    this.token = normalizedToken;
    this.timeExpiration = normalizedExpiration;
    this.persistStorageValue(this.tokenStorageKey, normalizedToken);
    this.persistStorageValue(this.expirationStorageKey, normalizedExpiration.toString());
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
      return Number.isFinite(expiration) && expiration > 0 ? expiration : 0;
    } catch {
      return 0;
    }
  }

  loadToken(): string {
    try {
      return localStorage.getItem(this.tokenStorageKey)?.trim() ?? '';
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
    const normalizedToken = token.trim();
    this.token = normalizedToken;

    if (normalizedToken) {
      this.persistStorageValue(this.tokenStorageKey, normalizedToken);
      return;
    }

    this.removeStorageValue(this.tokenStorageKey);
  }

  set setTimeExpiration(timeExpiration: number) {
    const normalizedExpiration = Number.isFinite(timeExpiration) ? timeExpiration : 0;
    this.timeExpiration = normalizedExpiration > 0 ? normalizedExpiration : 0;

    if (this.timeExpiration > 0) {
      this.persistStorageValue(this.expirationStorageKey, this.timeExpiration.toString());
      return;
    }

    this.removeStorageValue(this.expirationStorageKey);
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

  private persistStorageValue(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Ignora fallos de almacenamiento y conserva el valor solo en memoria.
    }
  }

  private removeStorageValue(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignora fallos de almacenamiento y conserva la limpieza solo en memoria.
    }
  }
}
