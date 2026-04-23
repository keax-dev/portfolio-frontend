import { CanMatchFn, UrlTree } from '@angular/router';
import { SessionService } from '@core/services/session.service';
import { inject } from '@angular/core';

const resolveGuestAccess = (): true | UrlTree => {
  const sessionService = inject(SessionService);
  return sessionService.resolveGuestMatch();
};

export const guestMatchGuard: CanMatchFn = () => resolveGuestAccess();
