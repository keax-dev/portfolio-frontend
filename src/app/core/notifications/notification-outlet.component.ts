import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification-outlet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'notification-outlet position-fixed top-0 end-0 p-3',
  },
  styles: `
    :host {
      z-index: 12000;
      width: min(100%, 24rem);
      pointer-events: none;
    }

    .alert {
      pointer-events: auto;
    }
  `,
  template: `
    <div aria-atomic="true" aria-live="polite">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div
          [class.alert-success]="notification.kind === 'success'"
          [class.alert-warning]="notification.kind === 'warning'"
          [class.alert-danger]="notification.kind === 'error'"
          [class.alert-info]="notification.kind === 'info'"
          class="alert alert-dismissible shadow"
          role="status"
        >
          <strong>{{ notification.title }}</strong>
          <div>{{ notification.message }}</div>
          <button
            (click)="notificationService.dismiss(notification.id)"
            aria-label="Close notification"
            class="btn-close"
            type="button"
          ></button>
        </div>
      }
    </div>
  `,
})
export class NotificationOutletComponent {
  protected readonly notificationService = inject(NotificationService);
}
