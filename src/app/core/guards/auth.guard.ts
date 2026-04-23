import { CanMatchFn, UrlTree } from '@angular/router';
import { SessionService } from '@core/services/session.service';
import { inject } from '@angular/core';

const resolveAuthAccess = (): true | UrlTree => {
  const sessionService = inject(SessionService);
  return sessionService.resolveProtectedMatch();
};

export const authMatchGuard: CanMatchFn = () => resolveAuthAccess();
