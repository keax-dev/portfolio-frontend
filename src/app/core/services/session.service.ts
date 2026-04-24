import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { UserInfoService } from '@core/services/user-info.service';
import { AlertService } from '@core/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private userInfoService = inject(UserInfoService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  private expirationTimeoutId: ReturnType<typeof window.setTimeout> | null = null;

  resolveProtectedMatch(): true | UrlTree {
    if (this.userInfoService.hasValidSession) {
      return true;
    }

    if (this.clearExpiredStoredSession(true)) {
      return this.router.createUrlTree(['/login']);
    }

    this.alertService.warning('Unauthorized');
    return this.router.createUrlTree(['/login']);
  }

  resolveGuestMatch(): true | UrlTree {
    if (this.clearExpiredStoredSession(true)) {
      return true;
    }

    if (this.userInfoService.hasValidSession) {
      return this.router.createUrlTree(['/home']);
    }

    return true;
  }

  ensureProtectedSession(): boolean {
    if (this.userInfoService.hasValidSession) {
      this.startExpirationWatcher();
      return true;
    }

    const redirect = this.resolveProtectedMatch();
    if (redirect !== true) {
      void this.router.navigateByUrl(redirect);
    }

    return false;
  }

  normalizeStoredSession(): void {
    this.clearExpiredStoredSession();
  }

  startExpirationWatcher(): void {
    this.stopExpirationWatcher();

    if (!this.userInfoService.hasValidSession) {
      return;
    }

    this.expirationTimeoutId = window.setTimeout(() => {
      this.expirationTimeoutId = null;
      this.handleExpiredSessionRedirect();
    }, this.userInfoService.remainingSessionTime);
  }

  stopExpirationWatcher(): void {
    if (this.expirationTimeoutId === null) {
      return;
    }

    clearTimeout(this.expirationTimeoutId);
    this.expirationTimeoutId = null;
  }

  logOut(): void {
    this.stopExpirationWatcher();
    this.userInfoService.clearInfo();
    this.alertService.success('Log out');
    void this.router.navigateByUrl('/');
  }

  handleExpiredSessionRedirect(): void {
    this.stopExpirationWatcher();
    this.userInfoService.clearInfo();
    this.alertService.warning('Session expired');
    void this.router.navigateByUrl('/login');
  }

  clearExpiredStoredSession(notify = false): boolean {
    if (!this.userInfoService.hasStoredSession || this.userInfoService.hasValidSession) {
      return false;
    }

    this.stopExpirationWatcher();
    this.userInfoService.clearInfo();

    if (notify) {
      this.alertService.warning('Session expired');
    }

    return true;
  }

}
