import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { EMPTY, catchError, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionService } from '@core/services/session.service';
import { UserInfoService } from '@core/services/user-info.service';
import { environment } from '@src/environments/environment';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (request, next) => {

  const sessionService = inject(SessionService);
  const userInfoService = inject(UserInfoService);
  const spinner = inject(NgxSpinnerService);

  sessionService.normalizeStoredSession();

  const isApiRequest = request.url.startsWith(environment.url);
  const isLoginRequest = request.url.includes('/auth/login');
  const token = userInfoService.hasValidSession ? userInfoService.getToken : '';

  const requestWithHeaders = isApiRequest ? request.clone({
    setHeaders: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  }) : request;

  return next(requestWithHeaders)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !isLoginRequest && userInfoService.hasStoredSession) {
          spinner.hide();
          sessionService.handleExpiredSessionRedirect();
          return EMPTY;
        }

        return throwError(() => error);
      })
    );
};
