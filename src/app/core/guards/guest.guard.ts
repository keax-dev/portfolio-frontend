import { SessionService } from '@core/services/session.service';
import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';

export const guestMatchGuard: CanMatchFn = () => inject(SessionService).resolveGuestMatch();
