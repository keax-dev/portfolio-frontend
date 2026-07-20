import { CanMatchFn } from '@angular/router';
import { SessionService } from '@core/services/session.service';
import { inject } from '@angular/core';

export const guestMatchGuard: CanMatchFn = () => inject(SessionService).resolveGuestMatch();
