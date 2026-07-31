import { NotificationService } from '@core/notifications/notification.service';
import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { privateUiText } from '@core/i18n/private-ui-text';
import { ApiResponse } from '@core/interfaces/apiresponse';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private notifications = inject(NotificationService);

  success(sms: string): void {
    this.notifications.show('success', sms, privateUiText.alerts.successTitle);
  }

  info(sms: string): void {
    this.notifications.show('info', sms, privateUiText.alerts.infoTitle);
  }

  warning(sms: string): void {
    this.notifications.show('warning', sms, privateUiText.alerts.warningTitle);
  }

  error(sms: string, title?: string): void {
    this.notifications.show('error', sms, title || privateUiText.alerts.genericErrorTitle);
  }

  applicationError(sms?: string, title?: string): void {
    this.error(sms || privateUiText.alerts.contactSupport, title);
  }

  httpError(error: unknown, fallbackMessage?: string): void {
    if (!(error instanceof HttpErrorResponse)) {
      this.applicationError(fallbackMessage);
      return;
    }

    const response = this.asApiResponse(error.error);
    if (response) {
      response.messages?.forEach((message) => this.warning(message));
      this.error(
        response.alert || fallbackMessage || this.messageByStatus(error.status),
        this.titleByStatus(error.status),
      );
      return;
    }

    this.error(
      fallbackMessage || this.messageByStatus(error.status),
      this.titleByStatus(error.status),
    );
  }

  asApiResponse(error: unknown): ApiResponse<unknown> | null {
    if (!error || typeof error !== 'object') {
      return null;
    }

    const response = error as Partial<ApiResponse<unknown>>;
    if (typeof response.alert !== 'string') {
      return null;
    }

    return {
      alert: response.alert,
      status: Boolean(response.status),
      data: response.data as unknown,
      messages: Array.isArray(response.messages)
        ? response.messages.filter((message) => typeof message === 'string')
        : undefined,
    };
  }

  titleByStatus(status: number): string {
    return privateUiText.alerts.titlesByStatus[status] ?? privateUiText.alerts.genericErrorTitle;
  }

  messageByStatus(status: number): string {
    return privateUiText.alerts.messagesByStatus[status] ?? privateUiText.alerts.contactSupport;
  }
}
