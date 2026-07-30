import { TestBed } from '@angular/core/testing';
import { SessionExpiryScheduler } from '@core/services/session-expiry-scheduler.service';

describe('SessionExpiryScheduler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs the expiration callback after the configured delay', () => {
    const onExpired = vi.fn();
    TestBed.inject(SessionExpiryScheduler).schedule(1_000, onExpired);

    vi.advanceTimersByTime(999);
    expect(onExpired).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onExpired).toHaveBeenCalledOnce();
  });

  it('cancels an existing timer before scheduling another one', () => {
    const first = vi.fn();
    const second = vi.fn();
    const scheduler = TestBed.inject(SessionExpiryScheduler);

    scheduler.schedule(500, first);
    scheduler.schedule(1_000, second);
    vi.runAllTimers();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
  });

  it('cancels the pending expiration safely', () => {
    const onExpired = vi.fn();
    const scheduler = TestBed.inject(SessionExpiryScheduler);
    scheduler.schedule(100, onExpired);
    scheduler.cancel();
    scheduler.cancel();
    vi.runAllTimers();

    expect(onExpired).not.toHaveBeenCalled();
  });
});
