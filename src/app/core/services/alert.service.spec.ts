/**
 * Pruebas unitarias del mapeo de alertas, errores HTTP y confirmaciones destructivas.
 */
import { NotificationService } from '@core/notifications/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from './alert.service';
import { TestBed } from '@angular/core/testing';
import { Dialog } from '@angular/cdk/dialog';
import { of } from 'rxjs';

describe('AlertService', () => {
  let service: AlertService;
  let spinner: { hide: ReturnType<typeof vi.fn> };
  let notifications: { show: ReturnType<typeof vi.fn> };
  let dialog: { open: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    spinner = { hide: vi.fn() };
    notifications = { show: vi.fn() };
    dialog = { open: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        AlertService,
        { provide: NgxSpinnerService, useValue: spinner },
        { provide: NotificationService, useValue: notifications },
        { provide: Dialog, useValue: dialog },
      ],
    });
    service = TestBed.inject(AlertService);
  });

  // Caso: delegates typed notifications with their default titles.
  it('delegates typed notifications with their default titles', () => {
    service.success('Saved');
    service.info('Hello');
    service.warning('Careful');
    service.error('Failed');

    expect(notifications.show).toHaveBeenNthCalledWith(1, 'success', 'Saved', 'Success');
    expect(notifications.show).toHaveBeenNthCalledWith(2, 'info', 'Hello', 'Message');
    expect(notifications.show).toHaveBeenNthCalledWith(3, 'warning', 'Careful', 'Warning');
    expect(notifications.show).toHaveBeenNthCalledWith(4, 'error', 'Failed', 'An error occurred');
  });

  // Caso: uses custom application error text and hides the spinner.
  it('uses custom application error text and hides the spinner', () => {
    service.applicationError('Custom failure', 'Custom title');
    expect(spinner.hide).toHaveBeenCalled();
    expect(notifications.show).toHaveBeenCalledWith('error', 'Custom failure', 'Custom title');
  });

  // Casos parametrizados: aplica el mismo contrato a cada entrada definida.
  it.each([
    [400, 'Please review the submitted information', 'Invalid request'],
    [401, 'Your session is not valid', 'Unauthorized'],
    [403, 'You do not have permission to perform this action', 'Forbidden'],
    [404, 'The requested resource could not be found', 'Not found'],
    [409, 'The operation conflicts with existing data', 'Conflict'],
    [500, 'Please try again later', 'Server error'],
    [0, 'Unable to connect to the server', 'Connection error'],
    [418, 'Please contact support', 'An error occurred'],
  ])('maps HTTP status %s to a useful notification', (status, message, title) => {
    service.httpError(new HttpErrorResponse({ status }));
    expect(notifications.show).toHaveBeenCalledWith('error', message, title);
  });

  // Caso: shows backend warnings and alert text from a valid API response.
  it('shows backend warnings and alert text from a valid API response', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: {
        status: false,
        alert: 'Validation failed',
        messages: ['Name is required', 42],
      },
    });

    service.httpError(error);

    expect(notifications.show).toHaveBeenCalledWith('warning', 'Name is required', 'Warning');
    expect(notifications.show).toHaveBeenCalledWith(
      'error',
      'Validation failed',
      'Invalid request',
    );
  });

  // Caso: uses a fallback for non-HTTP errors.
  it('uses a fallback for non-HTTP errors', () => {
    service.httpError(new Error('boom'), 'Operation failed', false);
    expect(spinner.hide).not.toHaveBeenCalled();
    expect(notifications.show).toHaveBeenCalledWith(
      'error',
      'Operation failed',
      'An error occurred',
    );
  });

  // Caso: executes a delete action only after confirmation.
  it('executes a delete action only after confirmation', () => {
    const action = vi.fn();
    dialog.open.mockReturnValue({ closed: of(true) });

    service.confirmDelete(action);

    expect(action).toHaveBeenCalledOnce();
    expect(dialog.open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        data: expect.objectContaining({ confirmLabel: 'Confirm' }),
      }),
    );
  });

  // Caso: does not execute a delete action when confirmation is cancelled.
  it('does not execute a delete action when confirmation is cancelled', () => {
    const action = vi.fn();
    dialog.open.mockReturnValue({ closed: of(false) });
    service.confirmDelete(action);
    expect(action).not.toHaveBeenCalled();
  });
});
