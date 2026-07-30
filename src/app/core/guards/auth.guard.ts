import { SessionService } from '@core/services/session.service';
import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';

export const authMatchGuard: CanMatchFn = () => inject(SessionService).resolveProtectedMatch();
