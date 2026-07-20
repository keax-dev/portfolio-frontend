import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NotificationService } from '@core/notifications/notification.service';
import { AlertService } from '@core/services/alert.service';

describe('AlertService', () => {
  let service: AlertService;
  let notifications: { show: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    notifications = { show: vi.fn() };
    TestBed.configureTestingModule({
      providers: [AlertService, { provide: NotificationService, useValue: notifications }],
    });
    service = TestBed.inject(AlertService);
  });

  it('delegates typed notifications with their default titles', () => {
    service.success('Saved');
    service.info('Hello');
    service.warning('Careful');
    service.error('Failed');

    expect(notifications.show).toHaveBeenNthCalledWith(1, 'success', 'Saved', 'Success');
    expect(notifications.show).toHaveBeenNthCalledWith(2, 'info', 'Hello', 'Information');
    expect(notifications.show).toHaveBeenNthCalledWith(3, 'warning', 'Careful', 'Warning');
    expect(notifications.show).toHaveBeenNthCalledWith(4, 'error', 'Failed', 'An error occurred');
  });

  it('uses custom application error text', () => {
    service.applicationError('Custom failure', 'Custom title');
    expect(notifications.show).toHaveBeenCalledWith('error', 'Custom failure', 'Custom title');
  });

  it.each([
    [400, 'Review the submitted information', 'Invalid request'],
    [401, 'Your session is not valid', 'Unauthorized'],
    [403, 'You do not have permission to perform this action', 'Forbidden'],
    [404, 'The requested resource was not found', 'Not found'],
    [409, 'The operation conflicts with existing data', 'Conflict'],
    [500, 'Please try again later', 'Server error'],
    [0, 'Could not connect to the server', 'Connection error'],
    [418, 'Contact support', 'An error occurred'],
  ])('maps HTTP status %s to a useful notification', (status, message, title) => {
    service.httpError(new HttpErrorResponse({ status }));
    expect(notifications.show).toHaveBeenCalledWith('error', message, title);
  });

  it('shows backend warnings and alert text from a valid API response', () => {
    service.httpError(
      new HttpErrorResponse({
        status: 400,
        error: {
          status: false,
          alert: 'Validation failed',
          messages: ['Name is required', 42],
        },
      }),
    );

    expect(notifications.show).toHaveBeenCalledWith('warning', 'Name is required', 'Warning');
    expect(notifications.show).toHaveBeenCalledWith(
      'error',
      'Validation failed',
      'Invalid request',
    );
  });

  it('uses a fallback for non-HTTP errors', () => {
    service.httpError(new Error('boom'), 'Operation failed');
    expect(notifications.show).toHaveBeenCalledWith(
      'error',
      'Operation failed',
      'An error occurred',
    );
  });
});
