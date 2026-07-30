import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { UserInfoService } from '@core/services/user-info.service';
import { AlertService } from '@core/services/alert.service';
import { privateUiText } from '@core/i18n/private-ui-text';
import { SessionExpiryScheduler } from '@core/services/session-expiry-scheduler.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private userInfoService = inject(UserInfoService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  private expiryScheduler = inject(SessionExpiryScheduler);

  resolveProtectedMatch(): true | UrlTree {
    if (this.userInfoService.hasValidSession) {
      return true;
    }

    if (this.clearExpiredStoredSession(true)) {
      return this.router.createUrlTree(['/login']);
    }

    this.alertService.warning(privateUiText.session.unauthorized);
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
    if (!this.userInfoService.hasValidSession) {
      this.stopExpirationWatcher();
      return;
    }

    this.expiryScheduler.schedule(this.userInfoService.remainingSessionTime, () =>
      this.handleExpiredSessionRedirect(),
    );
  }

  stopExpirationWatcher(): void {
    this.expiryScheduler.cancel();
  }

  logOut(): void {
    this.stopExpirationWatcher();
    this.userInfoService.clearInfo();
    this.alertService.success(privateUiText.session.loggedOut);
    void this.router.navigateByUrl('/');
  }

  handleExpiredSessionRedirect(): void {
    this.stopExpirationWatcher();
    this.userInfoService.clearInfo();
    this.alertService.warning(privateUiText.session.expired);
    void this.router.navigateByUrl('/login');
  }

  clearExpiredStoredSession(notify = false): boolean {
    if (!this.userInfoService.hasStoredSession || this.userInfoService.hasValidSession) {
      return false;
    }

    this.stopExpirationWatcher();
    this.userInfoService.clearInfo();

    if (notify) {
      this.alertService.warning(privateUiText.session.expired);
    }

    return true;
  }
}
