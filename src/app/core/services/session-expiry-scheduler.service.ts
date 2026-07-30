import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionExpiryScheduler {
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  schedule(delay: number, onExpired: () => void): void {
    this.cancel();
    this.timeoutId = setTimeout(() => {
      this.timeoutId = null;
      onExpired();
    }, delay);
  }

  cancel(): void {
    if (this.timeoutId === null) {
      return;
    }

    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }
}
