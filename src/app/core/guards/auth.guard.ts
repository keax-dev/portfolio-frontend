import { CanMatchFn } from '@angular/router';
import { SessionService } from '@core/services/session.service';
import { inject } from '@angular/core';

export const authMatchGuard: CanMatchFn = () => inject(SessionService).resolveProtectedMatch();
