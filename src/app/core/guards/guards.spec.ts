/**
 * Pruebas unitarias de delegación de los guards hacia SessionService.
 */
import { guestMatchGuard } from './guest.guard';
import { authMatchGuard } from './auth.guard';
import { SessionService } from '@core/services/session.service';
import { TestBed } from '@angular/core/testing';
import { UrlTree } from '@angular/router';

describe('route guards', () => {
  // Caso: delegates protected access to SessionService.
  it('delegates protected access to SessionService', () => {
    const session = { resolveProtectedMatch: vi.fn().mockReturnValue(true) };
    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: session }],
    });

    const result = TestBed.runInInjectionContext(() =>
      authMatchGuard({} as never, [] as never, {} as never),
    );

    expect(result).toBe(true);
    expect(session.resolveProtectedMatch).toHaveBeenCalledOnce();
  });

  // Caso: returns the guest redirect from SessionService.
  it('returns the guest redirect from SessionService', () => {
    const redirect = {} as UrlTree;
    const session = { resolveGuestMatch: vi.fn().mockReturnValue(redirect) };
    TestBed.configureTestingModule({
      providers: [{ provide: SessionService, useValue: session }],
    });

    const result = TestBed.runInInjectionContext(() =>
      guestMatchGuard({} as never, [] as never, {} as never),
    );

    expect(result).toBe(redirect);
  });
});
