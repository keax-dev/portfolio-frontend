import { Injectable, signal } from '@angular/core';

export type NotificationKind = 'success' | 'info' | 'warning' | 'error';

export interface AppNotification {
  readonly id: number;
  readonly kind: NotificationKind;
  readonly message: string;
  readonly title: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsState = signal<readonly AppNotification[]>([]);
  private nextId = 0;

  readonly notifications = this.notificationsState.asReadonly();

  show(kind: NotificationKind, message: string, title: string): void {
    const id = ++this.nextId;
    this.notificationsState.update((notifications) => [
      ...notifications,
      { id, kind, message, title },
    ]);

    globalThis.setTimeout(() => this.dismiss(id), 5_000);
  }

  dismiss(id: number): void {
    this.notificationsState.update((notifications) =>
      notifications.filter((notification) => notification.id !== id),
    );
  }
}
