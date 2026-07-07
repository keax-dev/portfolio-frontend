import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { EMPTY, catchError, throwError } from 'rxjs';
import { UserInfoService } from '@core/services/user-info.service';
import { SessionService } from '@core/services/session.service';
import { environment } from '@src/environments/environment';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const userInfoService = inject(UserInfoService);
  const sessionService = inject(SessionService);

  sessionService.normalizeStoredSession();

  const isLoginRequest = request.url.includes('/auth/login');
  const isApiRequest = request.url.startsWith(environment.url);
  const token = userInfoService.hasValidSession ? userInfoService.getToken : '';

  const requestWithHeaders = isApiRequest
    ? request.clone({
        setHeaders: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
    : request;

  return next(requestWithHeaders).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isLoginRequest && userInfoService.hasStoredSession) {
        sessionService.handleExpiredSessionRedirect();
        return EMPTY;
      }

      return throwError(() => error);
    }),
  );
};
