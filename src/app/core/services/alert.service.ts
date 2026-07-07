import { ConfirmDialogComponent, ConfirmDialogData } from '@core/dialog/confirm-dialog.component';
import { NotificationService } from '@core/notifications/notification.service';
import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '@core/interfaces/apiresponse';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private notifications = inject(NotificationService);
  private dialog = inject(MatDialog);

  success(sms: string): void {
    this.notifications.show('success', sms, 'Success');
  }

  info(sms: string): void {
    this.notifications.show('info', sms, 'Information');
  }

  warning(sms: string): void {
    this.notifications.show('warning', sms, 'Warning');
  }

  error(sms: string, title?: string): void {
    this.notifications.show('error', sms, title || 'An error occurred');
  }

  applicationError(sms?: string, title?: string): void {
    this.error(sms || 'Contact support', title);
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

  resultWarnings<T>(response: ApiResponse<T>): void {
    response.messages?.forEach((message) => this.warning(message));
    this.error(response.alert);
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
    switch (status) {
      case 400:
        return 'Invalid request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not found';
      case 409:
        return 'Conflict';
      case 500:
        return 'Server error';
      case 0:
        return 'Connection error';
      default:
        return 'An error occurred';
    }
  }

  messageByStatus(status: number): string {
    switch (status) {
      case 400:
        return 'Review the submitted information';
      case 401:
        return 'Your session is not valid';
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return 'The requested resource was not found';
      case 409:
        return 'The operation conflicts with existing data';
      case 500:
        return 'Please try again later';
      case 0:
        return 'Could not connect to the server';
      default:
        return 'Contact support';
    }
  }

  confirmDelete(action: () => void): void {
    const dialogRef = this.dialog.open<ConfirmDialogComponent, ConfirmDialogData, boolean>(
      ConfirmDialogComponent,
      {
        data: {
          title: 'Are you sure?',
          message: 'This action cannot be undone.',
          confirmLabel: 'Confirm',
          cancelLabel: 'Cancel',
        },
        width: 'min(90vw, 28rem)',
      },
    );

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        action();
      }
    });
  }
}
