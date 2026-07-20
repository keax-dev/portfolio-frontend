import { inject, Injectable } from '@angular/core';
import { AUTH_STORAGE } from '@core/storage/auth-storage';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private readonly expirationStorageKey = 'expiration';
  private readonly tokenStorageKey = 'token';
  private readonly storage = inject(AUTH_STORAGE);

  private expirationTime = 0;
  private tokenValue = '';

  constructor() {
    this.expirationTime = this.loadTimeExpiration();
    this.tokenValue = this.loadToken();
  }

  clearInfo(): void {
    this.expirationTime = 0;
    this.tokenValue = '';
    this.storage.removeItem(this.expirationStorageKey);
    this.storage.removeItem(this.tokenStorageKey);
  }

  setSession(token: string, timeExpiration: number): void {
    const normalizedToken = token.trim();
    const normalizedExpiration = Number.isFinite(timeExpiration) ? timeExpiration : 0;

    if (!normalizedToken || normalizedExpiration <= 0) {
      this.clearInfo();
      return;
    }

    this.tokenValue = normalizedToken;
    this.expirationTime = normalizedExpiration;
    this.storage.setItem(this.tokenStorageKey, normalizedToken);
    this.storage.setItem(this.expirationStorageKey, normalizedExpiration.toString());
  }

  resolveTokenExpiration(token: string): number | null {
    const payload = this.parseJwtPayload(token);
    if (typeof payload?.exp !== 'number') return null;
    return payload.exp * 1000;
  }

  private loadTimeExpiration(): number {
    const storedExpiration = this.storage.getItem(this.expirationStorageKey);
    if (!storedExpiration) return 0;

    const expiration = Number(storedExpiration);
    return Number.isFinite(expiration) && expiration > 0 ? expiration : 0;
  }

  private loadToken(): string {
    return this.storage.getItem(this.tokenStorageKey)?.trim() ?? '';
  }

  parseJwtPayload(token: string): { exp?: number } | null {
    const [, payload] = token.split('.');
    if (!payload) return null;

    try {
      const normalizedPayload = payload
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');

      const parsed: unknown = JSON.parse(atob(normalizedPayload));
      if (!parsed || typeof parsed !== 'object') return null;

      const expiration = (parsed as Record<string, unknown>)['exp'];
      return typeof expiration === 'number' ? { exp: expiration } : {};
    } catch {
      return null;
    }
  }

  get token(): string {
    return this.tokenValue;
  }

  get expiresAt(): number {
    return this.expirationTime;
  }

  get hasValidSession(): boolean {
    return Boolean(this.tokenValue) && this.expirationTime > Date.now();
  }

  get hasStoredSession(): boolean {
    return Boolean(this.tokenValue) || this.expirationTime > 0;
  }

  get remainingSessionTime(): number {
    return Math.max(this.expirationTime - Date.now(), 0);
  }
}
